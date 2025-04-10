import { describe, it, expect, vi, beforeEach } from 'vitest';

// This would be the actual controller once implemented
// import { RepositoryController } from '../../presentation/controllers/RepositoryController';

// Mock services
const mockGitHubRepositoryService = {
  searchUserRepositories: vi.fn(),
  exportRepositoriesToCSV: vi.fn(),
  importRepositoriesFromCSV: vi.fn(),
  getRepositoriesByUserId: vi.fn(),
};

const mockQueueService = {
  sendToQueue: vi.fn(),
  notifyImportComplete: vi.fn(),
};

// Define types for request and response
interface MockRequest {
  params: Record<string, string>;
  body: Record<string, any>;
  query: Record<string, string>;
}

interface MockResponse {
  status: (code: number) => MockResponse;
  json: (data: any) => MockResponse;
  send: (data: any) => MockResponse;
}

// Mock controller with injected services
const mockRepositoryController = {
  searchRepositories: vi.fn(),
  exportRepositories: vi.fn(),
  importRepositories: vi.fn(),
  getImportedRepositories: vi.fn(),
};

// Mock request and response objects
const mockRequest = (): MockRequest => {
  return {
    params: {},
    body: {},
    query: {},
  };
};

const mockResponse = (): MockResponse => {
  const res: Partial<MockResponse> = {};
  res.status = vi.fn().mockReturnValue(res as MockResponse);
  res.json = vi.fn().mockReturnValue(res as MockResponse);
  res.send = vi.fn().mockReturnValue(res as MockResponse);
  return res as MockResponse;
};

describe('RepositoryController', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('searchRepositories', () => {
    it('should return repositories for a valid username', async () => {
      // Arrange
      const req = mockRequest();
      req.params.username = 'octocat';
      const res = mockResponse();
      
      const mockRepos = [
        { id: 1, name: 'repo1', owner: { login: 'octocat' }, stargazers_count: 10 },
        { id: 2, name: 'repo2', owner: { login: 'octocat' }, stargazers_count: 20 },
      ];
      
      mockRepositoryController.searchRepositories.mockImplementation(async (req, res) => {
        const repos = await mockGitHubRepositoryService.searchUserRepositories(req.params.username);
        return res.status(200).json(repos);
      });
      
      mockGitHubRepositoryService.searchUserRepositories.mockResolvedValue(mockRepos);

      // Act
      await mockRepositoryController.searchRepositories(req, res);

      // Assert
      expect(mockGitHubRepositoryService.searchUserRepositories).toHaveBeenCalledWith('octocat');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRepos);
    });

    it('should return 404 for non-existent username', async () => {
      // Arrange
      const req = mockRequest();
      req.params.username = 'non-existent-user';
      const res = mockResponse();
      
      mockRepositoryController.searchRepositories.mockImplementation(async (req, res) => {
        const repos = await mockGitHubRepositoryService.searchUserRepositories(req.params.username);
        if (repos.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(repos);
      });
      
      mockGitHubRepositoryService.searchUserRepositories.mockResolvedValue([]);

      // Act
      await mockRepositoryController.searchRepositories(req, res);

      // Assert
      expect(mockGitHubRepositoryService.searchUserRepositories).toHaveBeenCalledWith('non-existent-user');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('exportRepositories', () => {
    it('should export repositories to CSV for a given username', async () => {
      // Arrange
      const req = mockRequest();
      req.params.username = 'octocat';
      const res = mockResponse();
      
      const mockCSVData = 'id,name,owner,stars\n1,repo1,octocat,10\n2,repo2,octocat,20';
      
      mockRepositoryController.exportRepositories.mockImplementation(async (req, res) => {
        const csvData = await mockGitHubRepositoryService.exportRepositoriesToCSV(req.params.username);
        return res.status(200).send(csvData);
      });
      
      mockGitHubRepositoryService.exportRepositoriesToCSV.mockResolvedValue(mockCSVData);

      // Act
      await mockRepositoryController.exportRepositories(req, res);

      // Assert
      expect(mockGitHubRepositoryService.exportRepositoriesToCSV).toHaveBeenCalledWith('octocat');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockCSVData);
    });
  });

  describe('importRepositories', () => {
    it('should queue a repository import job', async () => {
      // Arrange
      const req = mockRequest();
      req.body = { 
        userId: 1,
        csvData: 'id,name,owner,stars\n1,repo1,octocat,10\n2,repo2,octocat,20'
      };
      const res = mockResponse();
      
      mockRepositoryController.importRepositories.mockImplementation(async (req, res) => {
        await mockQueueService.sendToQueue('repository_import', {
          userId: req.body.userId,
          csvData: req.body.csvData
        });
        return res.status(202).json({ message: 'Import job queued' });
      });
      
      mockQueueService.sendToQueue.mockResolvedValue(true);

      // Act
      await mockRepositoryController.importRepositories(req, res);

      // Assert
      expect(mockQueueService.sendToQueue).toHaveBeenCalledWith('repository_import', {
        userId: 1,
        csvData: 'id,name,owner,stars\n1,repo1,octocat,10\n2,repo2,octocat,20'
      });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ message: 'Import job queued' });
    });
  });

  describe('getImportedRepositories', () => {
    it('should return imported repositories for a user', async () => {
      // Arrange
      const req = mockRequest();
      req.params.userId = '1';
      const res = mockResponse();
      
      const mockRepos = [
        { id: 1, name: 'repo1', owner: 'octocat', stars: 10 },
        { id: 2, name: 'repo2', owner: 'octocat', stars: 20 },
      ];
      
      mockRepositoryController.getImportedRepositories.mockImplementation(async (req, res) => {
        const repos = await mockGitHubRepositoryService.getRepositoriesByUserId(parseInt(req.params.userId));
        return res.status(200).json(repos);
      });
      
      mockGitHubRepositoryService.getRepositoriesByUserId.mockResolvedValue(mockRepos);

      // Act
      await mockRepositoryController.getImportedRepositories(req, res);

      // Assert
      expect(mockGitHubRepositoryService.getRepositoriesByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRepos);
    });
  });
}); 