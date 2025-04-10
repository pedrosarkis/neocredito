console.log('--- APP.TS IS EXECUTING ---');
import HyperExpress from 'hyper-express';
import githubRoutes from './routes/github.js';

const WebServer = new HyperExpress.Server(); 

console.log('HyperExpress WebServer initialized.'); 

// CORS middleware for all routes
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  if (req.method === 'OPTIONS') return res.send()
  next()
}

WebServer.use(cors)    

// Base routes
WebServer.get('/', (request: any, response: any) => {
    console.log('Received request to /');
    response.send('GitHub Repository API is running');
});

// Register GitHub routes
WebServer.use('/api/github', githubRoutes);

WebServer.listen(3001)
    .then((socket: any) => console.log(`✅ WebServer listening on port 3001`))
    .catch((error: any) => console.error('❌ Failed to start WebServer:', error)); 

console.log('Attempting to start...'); 