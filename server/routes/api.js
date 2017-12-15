const http = require('http');
const express = require('express');
const router = express.Router();
const request = require('request');
const aws = require('aws-sdk');

const ipfilter = require('express-ipfilter').IpFilter;
const querystring = require('querystring');
const jwt = require('jwt-express');
aws.config.update({ region: 'us-east-1' });
const stateKey = 'spotify_auth_state';
const dynamodb = new aws.DynamoDB();

// router.use(ipfilter(['127.0.0.1'], { mode: 'allow' }));
router.use(jwt.init('secret'));

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
        client_id: 'f85c4d7a952c4cc5a1f915a0734c76e6',
        scope: 'user-top-read user-read-private',
        redirect_uri: 'http://localhost:3000/api/callback',
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
      form: { code: code, redirect_uri: 'http://localhost:3000/api/callback', grant_type: 'authorization_code' },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer('f85c4d7a952c4cc5a1f915a0734c76e6' + ':' + '448793fa018343bda05cd4db5e71cd38').toString('base64')
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
          } else {
            const userKey = generateRandomString(30);
            const params = {
              Key: {
                spotify_uri: {
                  S: body.uri
                }
              },
              ExpressionAttributeNames: {
                '#SL': 'song_list',
                '#UK': 'user_key'
              },
              ExpressionAttributeValues: {
                ':sl': {
                  S: 'new mock list'
                },
                ':uk': {
                  S: userKey
                }
              },
              ReturnConsumedCapacity: 'TOTAL',
              TableName: 'billboard_user',
              UpdateExpression: 'SET #SL = :sl, #UK = :uk'
            };
            dynamodb.updateItem(params, (err, data) => {
              if (err) {
                console.log(err, err.stack);
              } else {
                console.log(data);
              }
              const token = res.jwt({
                spotify_uri: body.uri
              });
              res.redirect(
                '/home?' +
                  querystring.stringify({
                    userKey: userKey
                  })
              );
            });
          }
        });
      }
    });
  }
});

router.get('/user', jwt.active(), function(req, res) {
  res.send('hello');
});

router.use(function(err, req, res, next) {
  if (err.name === 'JWTExpressError') {
    res.redirect('/api/login');
  } else {
    next(err);
  }
});

module.exports = router;
