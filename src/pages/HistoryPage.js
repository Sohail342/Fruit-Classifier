import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import apiService from '../services/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { formatDistanceToNow } from 'date-fns';

const API_URL = 'https://fruit-classifier-backend-production.up.railway.app/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await apiService.getHistory();
        setHistory(response.data.history);
        setError(null);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load classification history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Classification History
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {history.length === 0 ? (
        <Alert severity="info">
          No classification history found. Try classifying some images first!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {history.map((item) => {
            const timestamp = new Date(item.timestamp);
            return (
              <Grid item xs={12} sm={6} md={4} key={item.filename}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea component={RouterLink} to={`/results/${item.filename}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://94.136.188.243/uploads/${item.filename}`}
                      alt="Classified image"
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" noWrap>
                        {item.filename}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Classified {formatDistanceToNow(timestamp, { addSuffix: true })}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default HistoryPage;