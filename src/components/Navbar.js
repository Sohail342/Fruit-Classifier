import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';
import HistoryIcon from '@mui/icons-material/History';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <PhotoCameraIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Image Classifier
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              component={RouterLink}
              to="/upload"
              startIcon={<UploadIcon />}
              sx={{
                color: 'white',
                mx: 1,
                '&.active': {
                  borderBottom: '2px solid white',
                },
                borderBottom:
                  location.pathname === '/upload' || location.pathname === '/'
                    ? '2px solid white'
                    : 'none',
              }}
            >
              Upload
            </Button>
            <Button
              component={RouterLink}
              to="/history"
              startIcon={<HistoryIcon />}
              sx={{
                color: 'white',
                mx: 1,
                borderBottom:
                  location.pathname === '/history' ? '2px solid white' : 'none',
              }}
            >
              History
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography variant="body2" color="inherit">
              Powered by TensorFlow
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;