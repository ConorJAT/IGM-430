// Pull in file system module.
const fs = require('fs');

const getPage = (request, response, html) => {
  const index = fs.readFileSync(`${__dirname}/../client/${html}`);
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

module.exports.getPage = getPage;
