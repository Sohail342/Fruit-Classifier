import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import apiService from '../services/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const ResultsPage = () => {
  const { filename } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelType, setModelType] = useState('fruit_classifier');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await apiService.getResults(filename, modelType);
        setResults(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load classification results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (filename) {
      fetchResults();
    }
  }, [filename, modelType]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          component={RouterLink}
          to="/history"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to History
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!results) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">No results found for this image.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        component={RouterLink}
        to="/history"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to History
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Classification Results
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={4}>
        {/* Image Preview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={`http://localhost:8000/uploads/${filename}`}
              alt="Classified image"
              sx={{ height: 400, objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {filename}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Classification Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Detected Classes
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
                <InputLabel id="model-type-label">Model Type</InputLabel>
                <Select
                  labelId="model-type-label"
                  id="model-type-select"
                  value={modelType}
                  label="Model Type"
                  onChange={(e) => setModelType(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="fruit_classifier">Fruit Classifier</MenuItem>
                  <MenuItem value="mobilenet_v2">MobileNet V2 (General)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {results.results.map((result, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1">
                    {result.class_name}
                  </Typography>
                  <Typography variant="body2">
                    {(result.confidence * 100).toFixed(2)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={result.confidence * 100}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            ))}  
            </Paper>
          </Grid>
      </Grid>
    </Container>
  );
};

export default ResultsPage;