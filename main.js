const { PhotoBox } = require('photobox-core');

const photobox = new PhotoBox({ mainDir: __dirname });
photobox.start().catch(e => {
  photobox.logger.error('Failed to start bot! Exiting in 10 seconds...');
  photobox.logger.error(e);
  setTimeout(() => process.exit(0), 10000);
});