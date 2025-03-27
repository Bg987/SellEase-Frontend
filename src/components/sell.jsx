import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, Card, CircularProgress } from "@mui/material";
import { sell } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "./GS";

const categories = ["Automobiles", "Electronics", "Home Appliances"];

const Sell = () => {
    const navigate = useNavigate();
    const { isLoggedIn, dologout } = useGlobalState();
    const [loading, setLoading] = useState(false); // Loading state
    const [formData, setFormData] = useState({
        itemName: "",
        category: "",
        sellPrice: "",
        description: "",
        city: "",
        images: [],
    });

    useEffect(() => {
        const cityName = localStorage.getItem("City");
        if (cityName) {
            setFormData((prevData) => ({ ...prevData, city: cityName }));
        }
    }, []);

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("You can upload up to 5 images only.");
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            images: files,
        }));

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const data = new FormData();
            data.append("itemName", formData.itemName);
            data.append("category", formData.category);
            data.append("sellPrice", formData.sellPrice);
            data.append("description", formData.description);
            data.append("city", formData.city);

            formData.images.forEach((image) => {
                data.append("images", image);
            });

            await sell(data);
            alert("Item listed successfully");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to list item.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom align="center">
                    List an Item for Sale
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} required fullWidth />
                    
                    <TextField select label="Category" name="category" value={formData.category} onChange={handleChange} required fullWidth>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Price" name="sellPrice" type="number" value={formData.sellPrice} onChange={handleChange} required fullWidth />
                    <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} required fullWidth />
                    <TextField label="City" name="city" value={formData.city} onChange={handleChange} required fullWidth />

                    <input type="file" accept="image/*" multiple onChange={handleFileChange} />

                    {imagePreviews.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`preview-${index}`} width="100px" height="100px" />
                            ))}
                        </Box>
                    )}

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "List Item"}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default Sell;
