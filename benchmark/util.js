const fs = require('fs');
const path = require('path');

const Util = module.exports = {};

Util.iterateFolder = folderPath => {
  const files = fs.readdirSync(folderPath);
  return files.map(file => {
    const filePath = path.join(folderPath, file);
    const stat = fs.lstatSync(filePath);
    if(stat.isSymbolicLink()) {
      const realPath = fs.readlinkSync(filePath);
      if(stat.isFile() && file.endsWith('.js')) {
        return realPath;
      }else if(stat.isDirectory()) {
        return Util.iterateFolder(realPath);
      }
    }else if(stat.isFile() && file.endsWith('.js')) {
      return filePath;
    }else if(stat.isDirectory()) {
      return Util.iterateFolder(filePath);
    }
  });
};

Util.flatten = arr => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? Util.flatten(toFlatten) : toFlatten);
  }, []);
};