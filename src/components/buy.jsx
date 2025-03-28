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
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

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
        let filtered = history.filter((item) =>
            item.itemName.toLowerCase().includes(search.toLowerCase()) &&
            (filterCategory === "" || item.category === filterCategory) &&
            (filterCity === "" || item.city.toLowerCase().includes(filterCity.toLowerCase())) &&
            (filterStatus === "" || item.status.toLowerCase() === filterStatus.toLowerCase())
        );

        if (sortOrder === "recent") {
            filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        } else if (sortOrder === "oldest") {
            filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        }

        setFilteredHistory(filtered);
    }, [search, filterCategory, filterCity, filterStatus, sortOrder, history]);

    return (
        <Box sx={{ minHeight: "100vh", padding: 3, background: "#f9f9f9" }}>
            <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/dashboard")}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>
            <Typography variant="h4" gutterBottom>
                Your Sell History
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 3,
                }}
            >
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: search && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearch("")} size="small">
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

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

                <TextField
                    select
                    label="Category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Automobile">Automobile</MenuItem>
                    <MenuItem value="Home Appliances">Home Appliances</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Availability"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="sold">Sold</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Sort By"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="recent">Most Recent</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                </TextField>
            </Box>

            <Grid container spacing={3}>
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <Skeleton variant="rectangular" width="100%" height={180} />
                                <CardContent>
                                    <Skeleton width="60%" height={30} />
                                    <Skeleton width="80%" />
                                    <Skeleton width="50%" />
                                    <Skeleton width="70%" />
                                    <Skeleton width="90%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.sellId}>
                            <Card sx={{ height: "100%" }}>
                                {item.images?.length > 0 ? (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.images[0]}
                                        alt={item.itemName}
                                        loading="lazy"
                                        sx={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="/default-placeholder.jpg"
                                        alt="No Image"
                                        loading="lazy"
                                        sx={{ objectFit: "cover" }}
                                    />
                                )}

                                <CardContent>
                                    <Typography variant="h6">{item.itemName}</Typography>
                                    <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                                    <Typography variant="body2"><b>Price:</b> ₹{item.sellPrice}</Typography>
                                    <Typography variant="body2"><b>City: </b> {item.city}</Typography>
                                    <Typography variant="body2"><b>Status: </b> {item.status}</Typography>
                                    <Typography variant="body2">
                                        <b>Uploaded:</b> {formatDistanceToNow(new Date(item.uploadDate), { addSuffix: true })}
                                    </Typography>
                                    <Typography variant="body2"><b>Description:</b> {item.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="red" sx={{ mt: 2 }}>
                        No history available.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Buy;
