// puppeteer configuration
// https://pptr.dev/api/puppeteer.configuration
// Prevent puppeteer configuration to get interrupted by other usage
// Puppeteer basically save cache in home directory based.(~/.cache/puppeteer)

module.exports = {
  cacheDirectory: `${__dirname}/.cache/puppeteer`,
  logLevel: 'error',
};
