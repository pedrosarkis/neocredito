import { repositoriesToCSV } from '../utils/csv.js';

export const fetchGitHubUserRepos = async (username: string, token?: string) => {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
  const headers: { [key: string]: string } = { accept: 'application/vnd.github+json' };
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const repos = await response.json();
  
  return repos.map(({ id, name, owner, stargazers_count }) => ({
    id,
    name,
    owner: { login: owner.login },
    stargazers_count,
  }));
};

export const getGitHubRepositories = async (req, res) => {
  const { username } = req.params;
  const token = process.env.GITHUB_TOKEN;

  try {
    const repositories = await fetchGitHubUserRepos(username, token);
    res.json({ success: true, data: repositories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to get repositories' });
  }
};

export const exportGitHubRepositoriesCSV = async (req, res) => {
  const { username } = req.params;
  const token = process.env.GITHUB_TOKEN;

  try {
    const repositories = await fetchGitHubUserRepos(username, token);
    const csv = repositoriesToCSV(repositories);
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="${username}-repositories.csv"`);
    
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to export repositories' });
  }
};
