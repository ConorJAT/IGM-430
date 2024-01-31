// Pull in file system module.
const fs = require('fs');
const path = require('path');

const getMedia = (request, response, media, mediaType) => {
  // Create File object based on file input.
  const file = path.resolve(__dirname, `../client/${media}`);

  // Provides stats of file.
  fs.stat(file, (err, stats) => {
    // Check for if file is NOT NULL.
    if (err) {
      // Checks for error responses with file.
      if (err.code === 'ENOENT') { response.writeHead(404); }

      return response.end(err);
    }

    // Set up range header from request.headers.
    let { range } = request.headers;

    // If no range header is present, set default at "byte=0-".
    if (!range) { range = 'bytes=0-'; }

    // Create an array that will hold the beginning and end range. Also, removes "bytes=" prefix.
    const positions = range.replace(/bytes=/, '').split('-');

    // Translate the start range in base10.
    let start = parseInt(positions[0], 10);

    // Calculate total file size in bytes.
    const total = stats.size;

    // For the end range, if there is 2nd element, translate the value in base10.
    // Otherwise, take the total value and subtract it by 1.
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    // If the start is greater than the end range, reset the start range.
    if (start > end) { start = end - 1; }

    // Retrieve chunk size.
    const chunkSize = (end - start) + 1;

    // Create header to be written by the server.
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,    // How many bytes are we sending total.
      'Accept-Ranges': 'bytes',     // Type of data to expect the range.
      'Content-Length': chunkSize,  // How big the current chunk is in bytes.
      'Content-Type': mediaType,    // Encoding type top reassemble the bytes.
    });

    // Create stream to load amounts of the file as necessary.
    const stream = fs.createReadStream(file, { start, end });

    // When the file opens, connect the stream to the response.
    stream.on('open', () => { stream.pipe(response); });

    // When an error is present, close the stream and return the error.
    stream.on('error', (streamErr) => { response.end(streamErr); });

    return stream;
  });
};

module.exports.getMedia = getMedia;
