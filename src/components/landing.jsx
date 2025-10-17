import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { Category, Home, ShoppingBag } from "@mui/icons-material";
import { useGlobalState } from "./GS";
import { logout } from "../services/api";

const SellEaseLanding = () => {
  const { isLoggedIn, dologin, dologout } = useGlobalState();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isLoggedIn) {
      await logout();
      localStorage.removeItem("Uname");
      dologout();
    }
    navigate("/login");
  };

  const Click = async () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SellEase
          </Typography>
          <Button color="inherit" onClick={handleClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
          <Button color="inherit" onClick={() => navigate("/about")}>
            About
          </Button>
          <Button color="inherit" onClick={() => navigate("/contact")}>
            Contact
          </Button>
        </Toolbar>
      </AppBar>

      {/* Notice Banner */}
      <Alert
        severity="info"
        sx={{
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "#E3F2FD",
          color: "#0D47A1",
          fontWeight: "bold",
        }}
      >
        ⚙️ Note: Our backend is hosted on a free instance — it may take a few
        seconds to wake up when accessed for the first time. Thank you for your
        patience!
      </Alert>

      {/* Hero Section */}
      <Container sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h3" gutterBottom>
          Buy & Sell Second-Hand Items Easily
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Connect directly with buyers and sellers for a hassle-free experience.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={Click}
        >
          {isLoggedIn ? "Explore" : "Signup"}
        </Button>
      </Container>

      {/* Features Section */}
      <Container sx={{ my: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Home fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Simple & Direct
                </Typography>
                <Typography color="textSecondary">
                  Contact sellers instantly without intermediaries.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Category fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Wide Categories
                </Typography>
                <Typography color="textSecondary">
                  Find Electronics, Cars, Home Items & more.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <ShoppingBag fontSize="large" color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Sell Second-Hand Items
                </Typography>
                <Typography color="textSecondary">
                  Easily list and sell your used products.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <AppBar
        position="static"
        color="secondary"
        sx={{ mt: 5, py: 2, textAlign: "center" }}
      >
        <Typography variant="body1">
          &copy; 2025 SellEase by BG. All rights reserved.
        </Typography>
      </AppBar>
    </>
  );
};

export default SellEaseLanding;
