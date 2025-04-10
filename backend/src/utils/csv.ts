/**
 * Converts an array of objects to a CSV string
 * @param data Array of objects to convert
 * @param columns Object mapping field names to header labels
 * @returns CSV formatted string
 */
export const objectsToCSV = <T extends Record<string, any>>(
  data: T[],
  columns: Record<string, string>
): string => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Return just headers if no data
    return Object.values(columns).join(',') + '\n';
  }

  // Create header row
  const headers = Object.values(columns).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return Object.keys(columns)
      .map(key => {
        // Handle nested objects with dot notation (e.g., 'owner.login')
        const value = key.includes('.')
          ? key.split('.').reduce((obj, path) => obj && obj[path], item)
          : item[key];
        
        // Escape quotes and format values properly for CSV
        const formatted = value === null || value === undefined 
          ? '' 
          : String(value);
        
        // If value contains commas, quotes, or newlines, wrap in quotes
        return /[",\n\r]/.test(formatted)
          ? `"${formatted.replace(/"/g, '""')}"`
          : formatted;
      })
      .join(',');
  }).join('\n');

  // Combine headers and rows
  return headers + '\n' + rows;
}

/**
 * Converts GitHub repository data to CSV format
 * @param repositories Array of GitHub repository objects
 * @returns CSV formatted string
 */
export const repositoriesToCSV = (repositories: any[]): string => {
  const columns = {
    'name': 'Repository Name',
    'owner.login': 'Owner',
    'stargazers_count': 'Stars'
  };
  
  return objectsToCSV(repositories, columns);
} 