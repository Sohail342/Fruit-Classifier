import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="#">
            Image Classification Web App
          </Link>
          {' — Built with '}
          <Link color="inherit" href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener">
            FastAPI
          </Link>
          {', '}
          <Link color="inherit" href="https://reactjs.org/" target="_blank" rel="noopener">
            React
          </Link>
          {', '}
          <Link color="inherit" href="https://www.tensorflow.org/" target="_blank" rel="noopener">
            TensorFlow
          </Link>
          
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;