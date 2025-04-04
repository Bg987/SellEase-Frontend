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
    IconButton,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    useTheme
} from "@mui/material";
import { ArrowBack, Clear, ArrowLeft, ArrowRight, Close} from "@mui/icons-material";
import { historyFetch } from "../services/api";

const History = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("recent");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const cityName = localStorage.getItem("City");
        if (cityName) setFilterCity(cityName);

        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await historyFetch();
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

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

    const handleOpenDialog = (item) => {
        setSelectedItem(item);
        setImageIndex(0);
    };

    const handleCloseDialog = () => {
        setSelectedItem(null);
        setImageIndex(0);
    };

    const handleNextImage = () => {
        if (selectedItem && selectedItem.images.length > 1) {
            setImageIndex((prev) => (prev + 1) % selectedItem.images.length);
        }
    };

    const handlePrevImage = () => {
        if (selectedItem && selectedItem.images.length > 1) {
            setImageIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", padding: 3, background: "#f9f9f9" }}>
            {/* Back Button */}
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

            {/* Filters */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
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
                            <IconButton onClick={() => setSearch("")} size="small">
                                <Clear />
                            </IconButton>
                        ),
                    }}
                />

                <TextField
                    label="Filter by City"
                    variant="outlined"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    fullWidth
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
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Sold">Sold</MenuItem>
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

            {/* Items Grid */}
            <Grid container spacing={3}>
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" width="100%" height={180} />
                        </Grid>
                    ))
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.sellId}>
                            <Card sx={{ height: "100%", cursor: "pointer" }} onClick={() => handleOpenDialog(item)}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={item.images?.[0] || "/default-placeholder.jpg"}
                                    alt={item.itemName}
                                    sx={{ objectFit: "cover" }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{item.itemName}</Typography>
                                    <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                                    <Typography variant="body2"><b>Price:</b> ₹{item.sellPrice}</Typography>
                                    <Typography variant="body2"><b>Status:</b> {item.status}</Typography>
                                    <Typography variant="body2">
                                        <b>Uploaded:</b> {formatDistanceToNow(new Date(item.uploadDate), { addSuffix: true })}
                                    </Typography>
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
            {selectedItem && (
                <Dialog
                    open={Boolean(selectedItem)}
                    onClose={handleCloseDialog}
                    fullScreen={isMobile}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {selectedItem.itemName}
                        <IconButton onClick={handleCloseDialog}>
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ textAlign: "center" }}>
                        {/* Image with Navigation */}
                        <Box sx={{ position: "relative", width: "100%", height: 250, display: "flex", justifyContent: "center" }}>
                            {/* Previous Image Button */}
                            {selectedItem.images.length > 1 && (
                                <IconButton
                                    onClick={handlePrevImage}
                                    sx={{
                                        position: "absolute",
                                        left: 10,
                                        top: 10,  // Move to top
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
                                    }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                            )}

                            {/* Image Display */}
                            <CardMedia
                                component="img"
                                image={selectedItem.images?.[imageIndex] || "/default-placeholder.jpg"}
                                alt={selectedItem.itemName}
                                sx={{ maxWidth: "100%", maxHeight: 250, objectFit: "contain" }}
                            />

                            {/* Next Image Button */}
                            {selectedItem.images.length > 1 && (
                                <IconButton
                                    onClick={handleNextImage}
                                    sx={{
                                        position: "absolute",
                                        right: 10,
                                        top: 10,  // Move to top
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
                                    }}
                                >
                                    <ArrowRight />
                                </IconButton>
                            )}
                        </Box>


                        {/* Item Details */}
                        <Typography variant="body1" sx={{ mt: 2 }}><b>Category:</b> {selectedItem.category}</Typography>
                        <Typography variant="body1"><b>Price:</b> ₹{selectedItem.sellPrice}</Typography>
                        <Typography variant="body1"><b>City:</b> {selectedItem.city}</Typography>
                        <Typography variant="body1"><b>Status:</b> {selectedItem.status}</Typography>
                        <Typography variant="body1">
                            <b>Uploaded:</b> {formatDistanceToNow(new Date(selectedItem.uploadDate), { addSuffix: true })}
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default History;
