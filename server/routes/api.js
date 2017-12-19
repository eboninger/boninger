const http = require('http');
const express = require('express');
const router = express.Router();
const request = require('request');
const aws = require('aws-sdk');
const spotify = require('./spotify').SPOTIFY_CONFIG;

const ipfilter = require('express-ipfilter').IpFilter;
const IpDeniedError = require('express-ipfilter').IpDeniedError;
const querystring = require('querystring');
const jwt = require('jwt-express');
aws.config.update({ region: 'us-east-1' });
const stateKey = 'spotify_auth_state';
const dynamodb = new aws.DynamoDB();

router.use(ipfilter(['127.0.0.1'], { mode: 'allow' }));
router.use(jwt.init(spotify.X));

var generateRandomString = function(length) {
  var text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get('/login', function(req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: spotify.CLIENT_ID,
        scope: spotify.SCOPE,
        redirect_uri: spotify.REDIRECT_URI,
        state: state
      })
  );
});

router.get('/callback', function(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state != storedState) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: { code: code, redirect_uri: spotify.REDIRECT_URI, grant_type: 'authorization_code' },
      headers: {
        Authorization: 'Basic ' + new Buffer(spotify.CLIENT_ID + ':' + spotify.SECRET).toString('base64')
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          if (!body.uri) {
            res.direct('/home?error=no_user_data');
          } else if (!spotify.ACCEPT.includes(body.id)) {
            res.sendStatus(403);
          } else {
            const params = {
              Key: { spotify_uri: { S: body.uri } },
              ExpressionAttributeNames: { '#RT': 'refresh_token' },
              ExpressionAttributeValues: { ':rt': { S: refresh_token } },
              ReturnConsumedCapacity: 'TOTAL',
              TableName: 'billboard_user',
              UpdateExpression: 'SET #RT = :rt'
            };
            dynamodb.updateItem(params, (err, data) => {
              if (err) {
                console.log(err, err.stack);
              } else {
                console.log(data);
              }
              const token = res.jwt({
                spotify_uri: body.uri,
                access_token: access_token
              });
              res.redirect('/home');
            });
          }
        });
      }
    });
  }
});

router.get('/authorize', jwt.active(), function(req, res) {
  res.send(true);
});

router.get('/songs', jwt.active(), function(req, res) {
  const token = req.jwt;
  const params = { Key: { spotify_uri: { S: token.payload.spotify_uri } }, TableName: 'billboard_user' };
  dynamodb.getItem(params, (err, data) => {
    if (data.Item.song_list.L.length <= 0) {
      const options = {
        url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term',
        headers: { Authorization: 'Bearer ' + token.payload.access_token },
        json: true
      };
      request.get(options, (err, res, body) => {
        const song_list = body.items.map(item => ({
          M: {
            album: {
              M: {
                url: { S: item.album.external_urls.spotify },
                name: { S: item.album.name },
                small_image: { S: item.album.images[2].url },
                medium_image: { S: item.album.images[1].url },
                large_image: { S: item.album.images[0].url }
              }
            },
            artists: {
              L: item.artists.map(artist => ({
                M: { url: { S: artist.external_urls.spotify }, name: { S: artist.name } }
              }))
            },
            url: { S: item.external_urls.spotify },
            is_playable: { BOOL: item.is_playable },
            name: { S: item.name }
          }
        }));
        const params = {
          Key: { spotify_uri: { S: token.payload.spotify_uri } },
          ExpressionAttributeNames: { '#SL': 'song_list' },
          ExpressionAttributeValues: { ':sl': { L: song_list } },
          ReturnConsumedCapacity: 'TOTAL',
          TableName: 'billboard_user',
          UpdateExpression: 'SET #SL = :sl'
        };
        dynamodb.updateItem(params, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      });
    } else {
      res.send(
        data.Item.song_list.L.map(song => ({
          name: song.M.name.S,
          is_playable: song.M.is_playable.BOOL,
          artists: song.M.artists.L.map(artist => ({
            name: artist.M.name.S,
            url: artist.M.url.S
          })),
          album: {
            name: song.M.album.M.name.S,
            large_image: song.M.album.M.large_image.S,
            small_image: song.M.album.M.small_image.S,
            medium_image: song.M.album.M.medium_image.S,
            url: song.M.album.M.url.S
          },
          url: song.M.url
        }))
      );
    }
  });
});

router.use(function(err, req, res, next) {
  if (err.name === 'JWTExpressError') {
    res.send(false);
  } else if (err instanceof IpDeniedError) {
    res.sendStatus(403);
  } else {
    next(err);
  }
});

module.exports = router;
