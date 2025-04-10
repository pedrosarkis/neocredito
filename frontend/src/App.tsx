import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import GitHubIcon from '@mui/icons-material/GitHub';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import './App.css';
import axios from 'axios';

// Define repository interface
interface Repository {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  stargazers_count: number;
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockRepositories = [
    { id: 1, name: 'react-project', owner: 'johnsmith', stars: 120, language: 'JavaScript' },
    { id: 2, name: 'python-algorithms', owner: 'johnsmith', stars: 85, language: 'Python' },
    { id: 3, name: 'flutter-app', owner: 'johnsmith', stars: 47, language: 'Dart' },
    { id: 4, name: 'data-analysis-tools', owner: 'johnsmith', stars: 62, language: 'R' },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearch = async () => {
    if (searchUsername.trim()) {
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`http://localhost:3001/api/github/repositories/${searchUsername}`);
        
        if (response.data.success) {
          setRepositories(response.data.data);
        } else {
          setError('Failed to fetch repositories');
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportCSV = () => {
    if (searchUsername) {
      // Create download link and trigger click
      const downloadUrl = `http://localhost:3001/api/github/repositories/${searchUsername}/csv`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${searchUsername}-repositories.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File selected:', event.target.files?.[0]?.name);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <GitHubIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            GitHub Repository Manager
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ bgcolor: '#fff', borderBottom: 1, borderColor: 'divider', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg">
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            sx={{ '& .MuiTab-root': { fontWeight: 'medium', py: 2 } }}
          >
            <Tab label="Search Repositories" />
            <Tab label="Import Repositories" />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {currentTab === 0 && (
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.dark">
              Search GitHub Repositories
            </Typography>
            
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="body1" paragraph>
                Enter a GitHub username to search for their public repositories.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="GitHub Username"
                  value={searchUsername}
                  onChange={(e: { target: { value: any; }; }) => setSearchUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  onClick={handleSearch}
                  disabled={loading || !searchUsername.trim()}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                </Button>
              </Box>
            </Paper>

            {!loading && repositories.length > 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2" fontWeight="medium">
                    Repositories for {searchUsername}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportCSV}
                    disabled={repositories.length === 0}
                  >
                    Export to CSV
                  </Button>
                </Box>
                
                <Paper elevation={2}>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: 'primary.light' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Repository Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Owner</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Stars</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {repositories.map((repo) => (
                          <TableRow key={repo.id} hover>
                            <TableCell>{repo.name}</TableCell>
                            <TableCell>{repo.owner.login}</TableCell>
                            <TableCell>{repo.stargazers_count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            )}

            {error && (
              <Paper elevation={2} sx={{ p: 2, mt: 2, bgcolor: '#ffebee' }}>
                <Typography color="error">{error}</Typography>
              </Paper>
            )}
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.dark">
              Import GitHub Repositories
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Card elevation={3}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                      Import from CSV
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Upload a CSV file with GitHub repository data. The file should contain columns for repository name, owner, and stars.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<FileUploadIcon />}
                        size="large"
                        sx={{ py: 1.5, px: 3 }}
                      >
                        Choose CSV File
                        <input
                          type="file"
                          accept=".csv"
                          hidden
                          onChange={handleFileUpload}
                        />
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        Only CSV files are supported
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Card elevation={3}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                      Import Status
                    </Typography>
                    <Typography variant="body2" paragraph>
                      After importing a CSV file, the data will be processed and displayed in the table below.
                    </Typography>
                    <Box sx={{ 
                      height: 180, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px dashed grey.300'
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No data has been imported yet
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Paper elevation={2} sx={{ mt: 4 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'primary.light' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Repository Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Stars</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Language</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Import a CSV file to view repository data here
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Container>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'primary.dark', color: 'white', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            GitHub Repository Manager © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;