module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Replace with your image domain
  },
  env: {
    OCR_API_KEY: process.env.OCR_API_KEY, // Example of an environment variable
    NEXT_PUBLIC_CHUNKR_API_URL: process.env.NEXT_PUBLIC_CHUNKR_API_URL,
    NEXT_PUBLIC_CHUNKR_API_KEY: process.env.NEXT_PUBLIC_CHUNKR_API_KEY,
  },
};