/**
 * Utility functions for image handling and validation
 */

/**
 * Validates if a file is an image
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file is a valid image
 */
export const isValidImage = (file) => {
  if (!file) return false;
  
  // Check if file is an image by MIME type
  return file.type.startsWith('image/');
};

/**
 * Creates a preview URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} - Promise resolving to the preview URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !isValidImage(file)) {
      reject(new Error('Invalid image file'));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Formats file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets image dimensions (width and height)
 * @param {string} src - Image source URL
 * @returns {Promise<{width: number, height: number}>} - Promise resolving to image dimensions
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};