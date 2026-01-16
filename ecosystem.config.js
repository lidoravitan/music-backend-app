module.exports = {
  apps: [
    {
      name: 'music-backend',
      script: './lib/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
      },
      error_file: '/dev/stderr',
      out_file: '/dev/stdout',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Restart configuration
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      // Auto restart on these conditions
      kill_timeout: 5000,
      wait_ready: false,
    },
  ],
};
