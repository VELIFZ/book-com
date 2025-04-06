import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        className="not-found-paper"
      >
        <ErrorOutlineIcon className="not-found-icon" />
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph className="not-found-message">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Box className="not-found-buttons">
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound; 