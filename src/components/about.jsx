import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <Container sx={{ marginTop: 4, paddingBottom: 4 }}>
      <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
          About SellEase
        </Typography>
        <Typography variant="h6" sx={{ color: '#555' }}>
          The ultimate platform for buying and selling second-hand goods
        </Typography>
      </Box>
      {/* Mission Section */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                At <strong>SellEase</strong>, our mission is to create a seamless, trustworthy platform for buying and selling second-hand items in categories like automobiles, electronics, and home appliances. We aim to provide a simple, secure, and eco-friendly marketplace that promotes sustainable consumption and makes high-quality items accessible to everyone.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* What We Do Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
                What We Do
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                SellEase connects individuals and businesses looking to buy and sell pre-owned items. Whether you're upgrading your smartphone, looking for a second-hand car, or in need of reliable home appliances, SellEase is here to help you find exactly what you need.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', color: '#3f51b5', fontWeight: 600 }}>
          Why Choose SellEase?
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#3f51b5' }}>
                  Trusted Platform
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  With user verification, reviews, and secure payment options, we prioritize safety and trust in every transaction.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#3f51b5' }}>
                  Easy to Use
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Simple navigation, intuitive design, and user-friendly features ensure a seamless experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#3f51b5' }}>
                  Affordable
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Get the best deals on quality second-hand products that are much more affordable than new ones.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Vision and Values Section */}
      <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                To be the most reliable and eco-conscious marketplace for second-hand products, fostering a culture of sustainability and value in every transaction.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
                Our Values
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                <ul>
                  <li><strong>Trust and Transparency:</strong> We believe in fostering a safe and honest environment for all our users.</li>
                  <li><strong>Sustainability:</strong> By encouraging the reuse and recycling of items, we contribute to reducing waste and preserving the environment.</li>
                  <li><strong>Community:</strong> We bring together people who share the same goal: saving money and finding great deals while making the world a better place.</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action Section */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 600 }}>
          Join Us Today!
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', marginBottom: 2 }}>
          Start buying or selling with SellEase now, and be part of the growing movement for a more sustainable, budget-friendly future.
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
        <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
          <Link to="/signup" style={{ textDecoration: 'none', color: 'white' }}>
            Signup
          </Link>
        </Button>
        <Button variant="outlined" color="secondary">
          <Link to="/landing" style={{ textDecoration: 'none', color: '#3f51b5' }}>
            Back
          </Link>
        </Button>
      </Box>
    </Container>
  );
}

export default AboutPage;
