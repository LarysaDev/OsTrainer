import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "ostrainer.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7111';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
          },
        },
      },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/pingauth': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/register': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/login': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/logout': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/api/Auth/register': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/api/Auth/login': {
                target: 'https://localhost:7111/',
                secure: false,
                changeOrigin: true
            },
             '^/api/ganttchart/fcfs': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/api/assignment/createassignment': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/api/assignment/getteacherassignments': {
                target: 'https://localhost:7111/',
                secure: false
            },
            '^/api/assignment/getstudentassignments': {
                target: 'https://localhost:7111/',
                secure: false
            },
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})


