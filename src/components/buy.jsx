import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    MenuItem,
    CardMedia,
    Skeleton
} from "@mui/material";
import { ArrowBack, Chat } from "@mui/icons-material";
import { BuyItem } from "../services/api";

const Buy = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cityName = localStorage.getItem("City");
        if (cityName) setFilterCity(cityName);

        const fetchItems = async () => {
            try {
                const response = await BuyItem();
                if (response.data.success) {
                    setHistory(response.data.items);
                    setFilteredHistory(response.data.items);
                } else {
                    setHistory([]);
                    setFilteredHistory([]);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...history];

        if (filterCategory) filtered = filtered.filter(item => item.category === filterCategory);
        if (filterCity) filtered = filtered.filter(item => item.city === filterCity);
        if (filterStatus) filtered = filtered.filter(item => item.status === filterStatus);
        if (search) filtered = filtered.filter(item => item.itemName.toLowerCase().includes(search.toLowerCase()));

        if (sortOrder === "priceLow") filtered.sort((a, b) => a.sellPrice - b.sellPrice);
        if (sortOrder === "priceHigh") filtered.sort((a, b) => b.sellPrice - a.sellPrice);
        if (sortOrder === "newest") filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        setFilteredHistory(filtered);
    }, [filterCategory, filterCity, filterStatus, sortOrder, search, history]);

    return (
        <Box sx={{ minHeight: "100vh", padding: 3, background: "#f9f9f9" }}>
            <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")} sx={{ mb: 2 }}>
                Back to Dashboard
            </Button>

            <Typography variant="h4" gutterBottom>Buy Second Hand Items</Typography>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField select fullWidth label="Category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Automobile">Automobile</MenuItem>
                        <MenuItem value="Home Appliance">Home Appliance</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                <TextField
                    label="Filter by City"
                    variant="outlined"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: filterCity && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setFilterCity("")} size="small">
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField select fullWidth label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Sold">Sold</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField select fullWidth label="Sort By" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="priceLow">Price: Low to High</MenuItem>
                        <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            {/* Display Items */}
            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <Skeleton variant="rectangular" width="100%" height={180} />
                                <CardContent>
                                    <Skeleton width="60%" />
                                    <Skeleton width="80%" />
                                    <Skeleton width="40%" />
                                    <Skeleton width="90%" />
                                    <Skeleton variant="rectangular" width="100%" height={36} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.sellId}>
                            <Card>
                                {item.images?.length > 0 ? (
                                    <CardMedia component="img" height="180" image={item.images[0]} alt={item.itemName} loading="lazy" />
                                ) : (
                                    <CardMedia component="img" height="180" image="/default-placeholder.jpg" alt="No Image" loading="lazy" />
                                )}
                                <CardContent>
                                    <Typography variant="h6"><b>{item.itemName}</b></Typography>
                                    <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                                    <Typography variant="body2"><b>Price:</b> ₹{item.sellPrice}</Typography>
                                    <Typography variant="body2"><b>City:</b> {item.city}</Typography>
                                    <Typography variant="body2"><b>Status:</b> {item.status}</Typography>
                                    <Typography variant="body2">
                                        <b>Uploaded:</b> {formatDistanceToNow(new Date(item.uploadDate), { addSuffix: true })}
                                    </Typography>
                                    <Typography variant="body2"><b>Description:</b> {item.description}</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Chat />}
                                        sx={{ mt: 2 }}
                                        onClick={() => navigate(`/chat`, { state: { item } })}
                                    >
                                        Chat
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="red" sx={{ mt: 2 }}>
                        {filterCity ? `No items for sale in ${filterCity}` : "No items for sale"}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Buy;
