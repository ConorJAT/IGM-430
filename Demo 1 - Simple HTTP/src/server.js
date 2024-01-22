// const myData = require('./myData.js');
// const _ = require('underscore');

// const helloWorld = () => { 
//     let newVar = 5;
//     console.log("Hello World");
//     console.log(newVar); 
// };

// const myArray = [1, 2, 3, 4, 5];
// console.log(_.chunk(myArray, 3));

// helloWorld();
// myData.getMessage();

const http = require('http');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello Server');
    response.end();
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Server running on port ${port}`);
});