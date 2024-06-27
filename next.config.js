/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['test.scano.kz', 'scano-0df0b7c835bf.herokuapp.com'],
    },
}

module.exports = withNextIntl(nextConfig);
