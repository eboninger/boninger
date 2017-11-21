module.exports = {
    apps: [
        {
            name: 'boninger',
            script: './server.js'
        }
    ],
    deploy: {
        production: {
            user: 'ubuntu',
            host: 'ec2-34-237-114-155.compute-1.amazonaws.com',
            key: '~/.ssh/node-server-key-pair.pem',
            ref: 'origin/master',
            repo: 'https://github.com/eboninger/boninger.git',
            path: '/home/ubuntu/boninger',
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.js'
        }
    }
};
