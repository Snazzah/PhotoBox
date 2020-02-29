const fs = require('fs');
const path = require('path');
const config = require('config');
const Util = require('./util');
global.ImageCode = require('../Classes/ImageCode');

const { ImageProcess } = require('photobox-core');
const IP = new ImageProcess();
process.env.LOGGER_DEBUG = 'false';

const BenchmarkConstants = {
  PICTURE1: fs.readFileSync(path.join(__dirname, './resources/picture1.jpg')),
  PICTURE2: fs.readFileSync(path.join(__dirname, './resources/picture2.jpg')),
  NORMAL_TEXT: 'Making a 140-character sentence is not always that easy when you are constantly thinking of words to use that may or may not be cool to use.',
  USERNAME: 'PhotoBox',
  SMALL_WORD: 'Potato',
};

const imageCodesPaths = Util.flatten(Util.iterateFolder(path.resolve(config.get('image_codes'))));
const imageCodes = imageCodesPaths.map(codePath => {
  const imageCode = require(codePath);
  return {
    path: codePath,
    code: path.parse(codePath).name,
    message: imageCode.benchmark ? imageCode.benchmark(BenchmarkConstants) : null,
  };
});

const counters = {
  passed: 0,
  skipped: 0,
  failed: 0,
};

const startTime = Date.now();

console.log('');

(async () => {
  for (let i = 0, len = imageCodes.length; i < len; i++) {
    const imageCode = imageCodes[i];

    if(!imageCode.message) {
      counters.skipped++;
      continue;
    }

    const codeStartTime = Date.now();

    try {
      await IP.send({
        code: imageCode.code,
        path: imageCode.path,
        ...imageCode.message,
      });
      counters.passed++;
      console.log(`- ${imageCode.code}: ${Date.now() - codeStartTime} ms`);
    } catch (e) {
      counters.failed++;
      console.log(`! ${imageCode.code}: ${Date.now() - codeStartTime} ms`);
    }
  }

  console.log(`\n- ${counters.failed ? '(!) ' : ''}took ${Date.now() - startTime} ms, ${counters.passed} passed, ${counters.failed} failed, ${counters.skipped} skipped`);
})();