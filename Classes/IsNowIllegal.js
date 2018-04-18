const path = require('path');

let b64ToBuf = function(str) {
  var binstr = new Buffer(str || '', 'base64').toString();
  var bin = new Uint8Array(binstr.length)
  for (var i = 0; i < binstr.length; i++) {
    bin[i] = binstr.charCodeAt(i)
  }
  return bin.buffer
}

module.exports = (text) => {
  return new Promise((resolve,reject)=>{
    require('python-shell').run("generate-b64.py", {
        pythonPath: 'python3',
        scriptPath: path.join(__dirname, '/../mods/IsNowIllegal/rotoscope'),
        args: [text, path.join(__dirname, '/../mods/IsNowIllegal/Images'), "output.gif"]
      }, (err,results)=>{
        if(err) reject(err);
        console.log(results.length, results[2])
        resolve(Buffer.from(results[1], 'base64'));
      })
  })
};
