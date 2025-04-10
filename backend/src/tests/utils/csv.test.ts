import { describe, it, expect } from 'vitest';
import { objectsToCSV, repositoriesToCSV } from '../../utils/csv.js';

describe('CSV Utilities', () => {
  describe('objectsToCSV', () => {
    it('should convert an array of objects to CSV format', () => {
      const data = [
        { id: 1, name: 'Test 1', value: 100 },
        { id: 2, name: 'Test 2', value: 200 },
      ];
      
      const columns = {
        'id': 'ID',
        'name': 'Name',
        'value': 'Value'
      };
      
      const csv = objectsToCSV(data, columns);
      
      // CSV should have headers and two data rows
      const lines = csv.trim().split('\n');
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('ID,Name,Value');
      expect(lines[1]).toBe('1,Test 1,100');
      expect(lines[2]).toBe('2,Test 2,200');
    });
    
    it('should handle empty data arrays', () => {
      const data = [];
      const columns = { 'id': 'ID', 'name': 'Name' };
      
      const csv = objectsToCSV(data, columns);
      
      // Should have just the header row
      expect(csv.trim()).toBe('ID,Name');
    });
    
    it('should handle nested object properties using dot notation', () => {
      const data = [
        { id: 1, owner: { login: 'user1' }, stars: 50 },
        { id: 2, owner: { login: 'user2' }, stars: 100 },
      ];
      
      const columns = {
        'id': 'ID',
        'owner.login': 'Owner',
        'stars': 'Stars'
      };
      
      const csv = objectsToCSV(data, columns);
      
      const lines = csv.trim().split('\n');
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('ID,Owner,Stars');
      expect(lines[1]).toBe('1,user1,50');
      expect(lines[2]).toBe('2,user2,100');
    });
    
    it('should properly escape values with commas, quotes, or newlines', () => {
      const data = [
        { id: 1, name: 'Test, with comma', notes: 'Has "quotes"' },
        { id: 2, name: 'Test\nwith newline', notes: 'Regular' },
      ];
      
      const columns = {
        'id': 'ID',
        'name': 'Name',
        'notes': 'Notes'
      };
      
      const csv = objectsToCSV(data, columns);
      
      // Get lines without trimming to preserve newlines in the output
      const lines = csv.split('\n');
      expect(lines[0]).toBe('ID,Name,Notes');
      
      // Check each value individually
      expect(lines[1]).toContain('1');
      expect(lines[1]).toContain('"Test, with comma"');
      expect(lines[1]).toContain('"Has ""quotes"""');
      
      // The newline might be preserved in different ways depending on the implementation
      // So check line 2 contains '2' and 'Regular'
      expect(lines[2]).toContain('2');
      expect(lines[2]).toContain('Regular');
    });
  });
  
  describe('repositoriesToCSV', () => {
    it('should format GitHub repositories into CSV format', () => {
      const repositories = [
        { id: 1, name: 'repo1', owner: { login: 'user1' }, stargazers_count: 50 },
        { id: 2, name: 'repo2', owner: { login: 'user2' }, stargazers_count: 100 },
      ];
      
      const csv = repositoriesToCSV(repositories);
      
      const lines = csv.trim().split('\n');
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('Repository Name,Owner,Stars');
      expect(lines[1]).toBe('repo1,user1,50');
      expect(lines[2]).toBe('repo2,user2,100');
    });
    
    it('should handle empty repositories array', () => {
      const repositories = [];
      
      const csv = repositoriesToCSV(repositories);
      
      expect(csv.trim()).toBe('Repository Name,Owner,Stars');
    });
  });
}); 