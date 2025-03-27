import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <Container sx={{ marginTop: 4, paddingBottom: 4 }}>
      <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
          Contact Information
        </Typography>
        <Typography variant="h6" sx={{ color: '#555' }}>
          You can reach us through the following contact details:
        </Typography>
      </Box>

      {/* Contact Details Card */}
      <Card sx={{ maxWidth: 600, margin: '0 auto', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
            Developer
          </Typography>

          {/* Name */}
          <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
            <strong>Name:</strong> Godhaniya Bhavya
          </Typography>

          {/* Email (Clickable) */}
          <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
            <strong>Email:</strong>{' '}
            <a href="mailto:bhavyagodhaniya2004@gmail.com" style={{ color: '#3f51b5', textDecoration: 'none' }}>
              bhavyagodhaniya2004@gmail.com
            </a>
          </Typography>

          {/* Contact Number (Clickable) */}
          <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
            <strong>Contact Number:</strong>{' '}
            <a href="tel:+919979710503" style={{ color: '#3f51b5', textDecoration: 'none' }}>
              +91 9979710503
            </a>
          </Typography>
        </CardContent>
      </Card>

      {/* Signup & Back Links */}
      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
        <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
          <Link to="/signup" style={{ textDecoration: 'none', color: 'white' }}>
            Signup
          </Link>
        </Button>
        <Button variant="outlined" color="secondary">
          <Link to="/" style={{ textDecoration: 'none', color: '#3f51b5' }}>
            Back
          </Link>
        </Button>
      </Box>
    </Container>
  );
}

export default Contact;
