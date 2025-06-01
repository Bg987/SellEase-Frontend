import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent } from "@mui/material";
import { Category, Home, ShoppingBag } from "@mui/icons-material";
import { useGlobalState } from './GS';
import { logout } from "../services/api";

const SellEaseLanding = () => {
  const { isLoggedIn, dologin, dologout } = useGlobalState();
  const navigate = useNavigate();
  const handleClick = async() => {
    if (isLoggedIn) {
      await logout();
      localStorage.removeItem("Uname");
      dologout();
    }
      navigate("/login");
  }
  const Click = async() => {
    if (isLoggedIn) {
     navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  }
  return (
    <>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
          </Typography>
          <Button color="inherit" onClick={handleClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
          <Button color="inherit" onClick={() => navigate("/about")}>About</Button>
          <Button color="inherit" onClick={() => navigate("/contact")}>Contact</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h3" gutterBottom>
          Buy & Sell Second-Hand Items Easily
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Connect directly with buyers and sellers for a hassle-free experience.
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }} onClick={Click}>
        {isLoggedIn ? "Explore" : "Signup"}
        </Button>
      </Container>

      {/* Features Section */}
      <Container sx={{ my: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Home fontSize="large" />
                <Typography variant="h6">Simple & Direct</Typography>
                <Typography color="textSecondary">Contact sellers instantly without intermediaries.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Category fontSize="large" />
                <Typography variant="h6">Wide Categories</Typography>
                <Typography color="textSecondary">Find Electronics, Cars, Home Items & more.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <ShoppingBag fontSize="large" />
                <Typography variant="h6">Sell Second-Hand Items</Typography>
                <Typography color="textSecondary">Easily list and sell your used products.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <AppBar position="static" color="secondary" sx={{ mt: 5, py: 2, textAlign: "center" }}>
        <Typography variant="body1">&copy; 2025 SellEase By BG</Typography>
      </AppBar>
    </>
  );
};

export default SellEaseLanding;
