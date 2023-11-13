/* This file use for pm2 */

const path = require('path')

module.exports = {
  apps: [
    {
      name: 'kun-galgame-koa', // Application name
      script: './dist/kun.js', // Startup script (compiled JavaScript file)
      cwd: path.join(__dirname), // Application directory
      instances: 1, // Number of instances to start
      autorestart: true, // Automatically restart
      watch: false, // Watch for file changes and auto-restart
      max_memory_restart: '1G', // Restart when memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production', // Set environment variable
      },
    },
  ],
}
