import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { isValidImage, createImagePreview } from '../utils/imageUtils';

const API_URL = 'http://94.136.188.243/api/';

// Styled component for the file input
const VisuallyHiddenInput = styled('input')(`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`);

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelType, setModelType] = useState('fruit_classifier');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!isValidImage(selectedFile)) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        setFile(null);
        setPreview(null);
        return;
      }

      setFile(selectedFile);
      setError(null);

      // Create preview URL
      createImagePreview(selectedFile)
        .then(previewUrl => setPreview(previewUrl))
        .catch(err => {
          console.error('Error creating preview:', err);
          setError('Failed to create image preview');
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select an image to classify');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file with progress tracking
      const response = await apiService.classifyImage(formData, modelType, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      // Navigate to results page
      navigate(`/results/${response.data.filename}`);
    } catch (err) {
      console.error('Error uploading image:', err);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
      } else if (err.response) {
        // The server responded with a status code outside the 2xx range
        if (err.response.status === 400) {
          errorMessage = 'Bad request: The server could not process your image. Please try a different image format.';
        } else if (err.response.status === 413) {
          errorMessage = 'Image too large: Please select a smaller image file.';
        } else if (err.response.status === 415) {
          errorMessage = 'Unsupported file type: Please select a valid image file (JPEG, PNG, etc.).';
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server: The server is not responding. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Classification
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Upload an image to classify it using TensorFlow
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Upload Image
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  mb: 3,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                  disabled={loading}
                >
                  Select Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: JPEG, PNG, GIF
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
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
                </Select>
              </FormControl>
              
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              {loading ? (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <CircularProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Uploading... {uploadProgress}%
                  </Typography>
                </Box>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!file}
                  sx={{ mt: 2 }}
                >
                  Classify Image
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Image Preview
            </Typography>
            <Box
              sx={{
                mt: 2,
                width: '100%',
                height: 300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 60, opacity: 0.5, mb: 1 }} />
                  <Typography variant="body2">
                    No image selected
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UploadPage;