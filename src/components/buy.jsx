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
    useMediaQuery,
    InputAdornment,
    IconButton
} from "@mui/material";
import { ArrowBack, Clear,Chat } from "@mui/icons-material";
import { BuyItem } from "../services/api";

const Buy = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const handleChat = (sellerId,name,item) => {
        if (!sellerId||!name||!item) {
            alert("error");
            return;
        }
        navigate(`/chat`, { state: {item} });
    };
    useEffect(() => {
        const cityName = localStorage.getItem("City");
        if(cityName){
            setFilterCity(cityName);
        }
        const fetch = async () => {
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
                setHistory([]);
                setFilteredHistory([]);
            }

        };
        fetch();
    }, [])
    useEffect(() => {
        let filtered = history.filter((item) =>
            item.itemName.toLowerCase().includes(search.toLowerCase()) &&
            (filterCategory === "" || item.category === filterCategory) &&
            (filterCity === "" || item.city.toLowerCase().includes(filterCity.toLowerCase())) &&
            (filterStatus === "" || item.status.toLowerCase() === filterStatus.toLowerCase())
        );

        // Apply sorting by uploadDate
        if (sortOrder === "recent") {
            filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)); // Newest First
        } else if (sortOrder === "oldest") {
            filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate)); // Oldest First
        }

        setFilteredHistory(filtered);
    }, [search, filterCategory, filterCity, filterStatus, sortOrder, history]);

    return (
        <Box sx={{ minHeight: "100vh", padding: 3, background: "#f9f9f9" }}>
            {/* Back Button */}
            <Button variant="contained" startIcon={<ArrowBack />}  sx={{ mb: 2 }} onClick={() => navigate("/messages")}>
                        Messages
                    </Button>
            <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/dashboard")}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>
            
            <Typography variant="h4" gutterBottom>
                Buy Second Hand items
            </Typography>

            {/* Search & Filters */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* Search Field */}
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

                {/* Filter by City */}
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

                {/* Filter by Category */}
                <TextField
                    select
                    label="Category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: filterCategory && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setFilterCategory("")} size="small">
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Automobile">Automobile</MenuItem>
                    <MenuItem value="Home Appliances">Home Appliances</MenuItem>
                </TextField>

                {/* Filter by Status */}

                {/* Sort By */}
                <TextField
                    select
                    label="Sort By"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: sortOrder && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSortOrder("")} size="small">
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value="recent">Most Recent</MenuItem>
                </TextField>
            </Box>

            {/* Render Filtered Data */}
            <Grid container spacing={3}>
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.sellId}>
                            <Card sx={{ height: "100%" }}>
                                {item.images?.length > 0 ? (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.images[0]} // First image
                                        alt={item.itemName}
                                        sx={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="/default-placeholder.jpg" // Placeholder
                                        alt="No Image"
                                        sx={{ objectFit: "cover" }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6"><b>{item.itemName}</b></Typography>
                                    <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                                    <Typography variant="body2"><b>Price:</b> ₹{item.sellPrice}</Typography>
                                    <Typography variant="body2"><b>City: </b> {item.city}</Typography>
                                    <Typography variant="body2"><b>Status: </b> {item.status}</Typography>
                                    <Typography variant="body2">
                                        <b>Uploaded:</b> {formatDistanceToNow(new Date(item.uploadDate), { addSuffix: true })}
                                    </Typography>
                                    <Typography variant="body2"><b>Discription:</b> {item.description}</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Chat />}
                                        sx={{ mt: 2 }}
                                        onClick={() => handleChat(item.userId, item.itemName,item)}
                                    >
                                        Chat
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="red" sx={{ mt: 2 }}>
                        { localStorage.getItem("City")? "no item for sell in your city":"no item for sell"}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default Buy;
