// @ts-check

const fs = require('fs');

function renderFile(res, htmlFile) {
  const pathResource = `./${htmlFile}`;
  fs.stat(pathResource, (err, stats) => {
    res.statusCode = 200;
    // ====================================================
    // content type header
    // ====================================================
    let contentType = 'text';

    if (htmlFile.endsWith('.html')) {
      contentType = 'text/html';
    } else if (htmlFile.endsWith('.js')) {
      contentType = 'text/javascript';
    } else if (htmlFile.endsWith('.css')) {
      contentType = 'text/css';
    }

    res.setHeader('Content-Type', contentType);
    // ====================================================
    if (stats) {
      fs.createReadStream(htmlFile).pipe(res);
    } else {
      res.statusCode = 404;
      res.end(`Sorry, page "${pathResource}" not found`);
    }
  });
}

function uuid_v4() {
  const UUID_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  const uuid = UUID_TEMPLATE.replace(/[xy]/g, (character) => {
    const randomNumber = (Math.random() * 16) | 0;
    const value = character == 'x' ? randomNumber : (randomNumber & 0x3) | 0x8;
    return value.toString(16);
  });
  return uuid;
}

module.exports = {
  renderFile,
  uuid_v4
}