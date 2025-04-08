console.log('--- APP.TS IS EXECsUTING ---');
import HyperExpress from 'hyper-express';

const WebServer = new HyperExpress.Server(); 

console.log('HyperExpress WebServer initialized.'); 

WebServer.get('/', (request: any, response: any) => {
    console.log('Received request to /');
    response.send('Hello World');
});

WebServer.listen(3001)
    .then((socket: any) => console.log(`✅ WebServer listening on port 444`))
    .catch((error: any) => console.error('❌ Failed to start WebServer:', error)); 

console.log('Attempting to start...'); 