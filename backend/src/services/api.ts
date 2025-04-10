import axios from 'axios';
import { GitHubRepo, LocalRepo } from '../types/index.js';

const API_URL = 'http://localhost:3001';

// GitHub API requests
export const searchUserRepositories = async (username: string): Promise<GitHubRepo[]> => {
  try {
    const response = await axios.get(`${API_URL}/repositories/${username}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const exportRepositoriesToCSV = async (username: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/repositories/${username}/export`, {
      responseType: 'blob'
    });
    
    // Convert blob to string
    const text = await response.data.text();
    return text;
  } catch (error: unknown) {
    throw error;
  }
};

// Local API requests
export const importRepositoriesFromCSV = async (userId: number, csvData: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/repositories/import`, {
      userId,
      csvData
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getImportedRepositories = async (userId: number): Promise<LocalRepo[]> => {
  try {
    const response = await axios.get(`${API_URL}/repositories/user/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}; 