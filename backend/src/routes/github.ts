import HyperExpress from 'hyper-express';
import { getGitHubRepositories, exportGitHubRepositoriesCSV } from '../controllers/github.js';

const router = new HyperExpress.Router();

router.get('/repositories/:username', getGitHubRepositories);

router.get('/repositories/:username/csv', exportGitHubRepositoriesCSV);

export default router; 