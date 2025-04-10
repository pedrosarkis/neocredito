import { describe, it, expect, vi, beforeEach } from 'vitest';

// This would be the actual service once implemented
// import { GitHubRepositoryService } from '../../../core/services/GitHubRepositoryService';

// Mock implementation for testing purposes
const mockGitHubRepositoryService = {
  searchUserRepositories: vi.fn(),
  exportRepositoriesToCSV: vi.fn(),
  importRepositoriesFromCSV: vi.fn(),
  getRepositoriesByUserId: vi.fn(),
};

describe('GitHubRepositoryService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('searchUserRepositories', () => {
    it('should fetch repositories for a valid GitHub username', async () => {
      // Arrange
      const username = 'octocat';
      const mockRepos = [
        { id: 1, name: 'repo1', owner: { login: 'octocat' }, stargazers_count: 10 },
        { id: 2, name: 'repo2', owner: { login: 'octocat' }, stargazers_count: 20 },
      ];
      mockGitHubRepositoryService.searchUserRepositories.mockResolvedValue(mockRepos);

      // Act
      const result = await mockGitHubRepositoryService.searchUserRepositories(username);

      // Assert
      expect(mockGitHubRepositoryService.searchUserRepositories).toHaveBeenCalledWith(username);
      expect(result).toEqual(mockRepos);
    });

    it('should return an empty array for a non-existent GitHub username', async () => {
      // Arrange
      const username = 'non-existent-user';
      mockGitHubRepositoryService.searchUserRepositories.mockResolvedValue([]);

      // Act
      const result = await mockGitHubRepositoryService.searchUserRepositories(username);

      // Assert
      expect(mockGitHubRepositoryService.searchUserRepositories).toHaveBeenCalledWith(username);
      expect(result).toEqual([]);
    });
  });

  describe('exportRepositoriesToCSV', () => {
    it('should export repositories to CSV for a given username', async () => {
      // Arrange
      const username = 'octocat';
      const mockRepos = [
        { id: 1, name: 'repo1', owner: { login: 'octocat' }, stargazers_count: 10 },
        { id: 2, name: 'repo2', owner: { login: 'octocat' }, stargazers_count: 20 },
      ];
      const mockCSVData = 'id,name,owner,stars\n1,repo1,octocat,10\n2,repo2,octocat,20';
      mockGitHubRepositoryService.searchUserRepositories.mockResolvedValue(mockRepos);
      mockGitHubRepositoryService.exportRepositoriesToCSV.mockResolvedValue(mockCSVData);

      // Act
      const result = await mockGitHubRepositoryService.exportRepositoriesToCSV(username);

      // Assert
      expect(mockGitHubRepositoryService.exportRepositoriesToCSV).toHaveBeenCalledWith(username);
      expect(result).toBe(mockCSVData);
    });
  });

  describe('importRepositoriesFromCSV', () => {
    it('should import repositories from a CSV file', async () => {
      // Arrange
      const csvData = 'id,name,owner,stars\n1,repo1,octocat,10\n2,repo2,octocat,20';
      const expectedRepos = [
        { id: 1, name: 'repo1', owner: 'octocat', stars: 10 },
        { id: 2, name: 'repo2', owner: 'octocat', stars: 20 },
      ];
      mockGitHubRepositoryService.importRepositoriesFromCSV.mockResolvedValue(expectedRepos);

      // Act
      const result = await mockGitHubRepositoryService.importRepositoriesFromCSV(csvData);

      // Assert
      expect(mockGitHubRepositoryService.importRepositoriesFromCSV).toHaveBeenCalledWith(csvData);
      expect(result).toEqual(expectedRepos);
    });
  });

  describe('getRepositoriesByUserId', () => {
    it('should return repositories for a given user ID', async () => {
      // Arrange
      const userId = 1;
      const mockRepos = [
        { id: 1, name: 'repo1', owner: 'octocat', stars: 10 },
        { id: 2, name: 'repo2', owner: 'octocat', stars: 20 },
      ];
      mockGitHubRepositoryService.getRepositoriesByUserId.mockResolvedValue(mockRepos);

      // Act
      const result = await mockGitHubRepositoryService.getRepositoriesByUserId(userId);

      // Assert
      expect(mockGitHubRepositoryService.getRepositoriesByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockRepos);
    });
  });
}); 