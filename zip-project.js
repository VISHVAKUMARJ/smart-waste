const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'SmartWasteTracker.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Exclude node_modules, target, .git, and .m2
const ignore = ['**/node_modules/**', '**/target/**', '**/.git/**', '**/.idea/**', '**/*.zip'];

archive.glob('**/*', {
  cwd: path.join(__dirname),
  ignore: ignore,
  dot: true
});

archive.finalize();
