module.exports = {
    apps: [
        {
            name: 'erp-backend',
            cwd: './apps/backend',
            script: 'src/index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            error_file: './logs/backend-error.log',
            out_file: './logs/backend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
        },
        {
            name: 'erp-frontend',
            cwd: './apps/frontend',
            script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3000',
            env: {
                NODE_ENV: 'production'
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            error_file: './logs/frontend-error.log',
            out_file: './logs/frontend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
        }
    ]
};
