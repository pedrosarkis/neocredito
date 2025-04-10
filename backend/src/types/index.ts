// GitHub API Types
export interface GitHubRepo {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  stargazers_count: number;
}

// Local Repository Types (After Import)
export interface LocalRepo {
  id: number;
  name: string;
  owner: string;
  stars: number;
} 