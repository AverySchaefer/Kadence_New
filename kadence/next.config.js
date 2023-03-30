/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    serverRuntimeConfig: {
        secret: 'd76800b5-229b-45e9-b923-3c873e3ead3e',
    },
    publicRuntimeConfig: {
        apiUrl:
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/api' // development api
                : 'http://kadenceapp.com/api', // production api
    },
};

module.exports = nextConfig;
