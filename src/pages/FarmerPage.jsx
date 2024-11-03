import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    AppBar,
    Toolbar,
    IconButton,
    Snackbar,
    Alert,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from './AuthContext';

const FarmerPage = () => {
    const { mode } = useAuth()
    const theme = useTheme();
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/farmer/product/getAllFarmerProducts", {
                    headers: { "auth-token": token },
                });
                setProducts(response.data.productItems);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleOpenDialog = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
        } else {
            setIsEditing(false);
            setCurrentProduct({});
        }
        setOpenDialog(true);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSaveProduct = async () => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("productName", currentProduct.productName);
        formData.append("category", currentProduct.category);
        formData.append("description", currentProduct.description);
        formData.append("price", currentProduct.price);
        formData.append("unit", currentProduct.unit);
        formData.append("stock", currentProduct.stock);
        formData.append("expiryDate", currentProduct.expiryDate);
        formData.append("farmingMethod", currentProduct.farmingMethod);
        formData.append("harvestDate", currentProduct.harvestDate);
        formData.append("deliveryTime", currentProduct.deliveryTime);

        // If a new image is uploaded, append it. Otherwise, append the existing image
        if (imageFile) {
            formData.append("image", imageFile);
        } else {
            // Convert the existing image to a Blob and append it
            const existingImage = currentProduct.image; // Assuming `image` holds base64 string of the image
            const response = await fetch(`data:image/png;base64,${existingImage}`);
            const blob = await response.blob();
            formData.append("image", blob, `${currentProduct.productName}.png`);
        }

        try {
            if (isEditing) {
                formData.append("id", currentProduct._id);
                await axios.put("http://localhost:3000/farmer/product/editproduct", formData, {
                    headers: {
                        "auth-token": token,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setSnackbarMessage('Product updated successfully!');
            } else {
                await axios.post("http://localhost:3000/farmer/product/addproduct", formData, {
                    headers: {
                        "auth-token": token,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setSnackbarMessage('Product added successfully!');
            }
            setSnackbarSeverity('success');
            setOpenDialog(false);
            window.location.reload();
        } catch (error) {
            console.error("Error saving product:", error);
            setSnackbarMessage('Error saving product. Please try again.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleDeleteProduct = async (id) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete("http://localhost:3000/farmer/product/deleteproduct", {
                headers: { "auth-token": token },
                data: { id },
            });
            setProducts(products.filter((product) => product._id !== id));
            setSnackbarMessage('Product deleted successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error("Error deleting product:", error);
            setSnackbarMessage('Error deleting product. Please try again.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{
            padding: "20px",
            backgroundColor: mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
            color: mode === 'dark' ? 'white' : 'black', // Overall text color
        }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1, color: mode === 'dark' ? 'white' : 'black' }}>
                        Farmer Product Management
                    </Typography>
                    <IconButton color="inherit" onClick={() => handleOpenDialog()}>
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Grid container spacing={4} style={{ marginTop: "20px" }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card elevation={3} style={{ borderRadius: '8px', backgroundColor: mode === 'dark' ? '#424242' : 'white' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`data:image/png;base64,${product.image}`}
                                alt={product.productName}
                                style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                    {product.productName}
                                </Typography>
                                <Typography color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Category: {product.category}
                                </Typography>
                                <Typography variant="body2" color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Description: {product.description}
                                </Typography>
                                <Typography variant="body1" color={mode === 'dark' ? 'white' : 'textPrimary'}>
                                    Price: ₹{product.price} / {product.unit}
                                </Typography>
                                <Typography variant="body2" color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Stock: {product.stock}
                                </Typography>
                                <Typography variant="body2" color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Harvest Date: {new Date(product.harvestDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Expiry Date: {new Date(product.expiryDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Farming Method: {product.farmingMethod}
                                </Typography>
                                <Typography variant="body2" color={mode === 'dark' ? 'white' : 'textSecondary'}>
                                    Delivery Time: {product.deliveryTime}
                                </Typography>
                                <div style={{ marginTop: '10px' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleOpenDialog(product)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for Adding/Editing Product */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <AppBar position="relative" style={{ backgroundColor: mode === 'dark' ? '#424242' : theme.palette.primary.main }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setOpenDialog(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" style={{ flexGrow: 1, color: mode === 'dark' ? 'white' : 'black' }}>
                            {isEditing ? "Edit Product" : "Add Product"}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{ backgroundColor: mode === 'dark' ? '#424242' : 'white', color: mode === 'dark' ? 'white' : 'black' }}>
                    <TextField
                        label="Product Name"
                        value={currentProduct.productName || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black', // Font color for input text
                                backgroundColor: mode === 'dark' ? '#616161' : 'white', // Background color for input
                            },
                        }}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel id="product-category-label" style={{ color: mode === 'dark' ? 'white' : 'black' }}>Category</InputLabel>
                        <Select
                            labelId="product-category-label"
                            value={currentProduct.category || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                            label="Category"
                            style={{ color: mode === 'dark' ? 'white' : 'black', backgroundColor: mode === 'dark' ? '#616161' : 'white' }} // Select color adjustment
                        >
                            <MenuItem value="Fruits">Fruits</MenuItem>
                            <MenuItem value="Vegetables">Vegetables</MenuItem>
                            <MenuItem value="Grains">Grains</MenuItem>
                            <MenuItem value="Dairy">Dairy</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Description"
                        value={currentProduct.description || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black', // Font color for input text
                                backgroundColor: mode === 'dark' ? '#616161' : 'white', // Background color for input
                            },
                        }}
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={currentProduct.price || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black',
                                backgroundColor: mode === 'dark' ? '#616161' : 'white',
                            },
                        }}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel id="product-unit-label" style={{ color: mode === 'dark' ? 'white' : 'black' }}>Unit</InputLabel>
                        <Select
                            labelId="product-unit-label"
                            value={currentProduct.unit || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                            label="Unit"
                            style={{ color: mode === 'dark' ? 'white' : 'black', backgroundColor: mode === 'dark' ? '#616161' : 'white' }} // Select color adjustment
                        >
                            <MenuItem value="kg">kg</MenuItem>
                            <MenuItem value="liter">litre</MenuItem>
                            <MenuItem value="unit">unit</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Stock"
                        type="number"
                        value={currentProduct.stock || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black',
                                backgroundColor: mode === 'dark' ? '#616161' : 'white',
                            },
                        }}
                    />
                    <TextField
                        label="Harvest Date"
                        type="date"
                        value={currentProduct.harvestDate ? new Date(currentProduct.harvestDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, harvestDate: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true, style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        variant="outlined"
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black',
                                backgroundColor: mode === 'dark' ? '#616161' : 'white',
                            },
                        }}
                    />
                    <TextField
                        label="Expiry Date"
                        type="date"
                        value={currentProduct.expiryDate ? new Date(currentProduct.expiryDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, expiryDate: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true, style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        variant="outlined"
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black',
                                backgroundColor: mode === 'dark' ? '#616161' : 'white',
                            },
                        }}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel id="product-farming-method-label" style={{ color: mode === 'dark' ? 'white' : 'black' }}>Farming Method</InputLabel>
                        <Select
                            labelId="product-farming-method-label"
                            value={currentProduct.farmingMethod || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, farmingMethod: e.target.value })}
                            label="Farming Method"
                            style={{ color: mode === 'dark' ? 'white' : 'black', backgroundColor: mode === 'dark' ? '#616161' : 'white' }} // Select color adjustment
                        >
                            <MenuItem value="Organic">Organic</MenuItem>
                            <MenuItem value="Conventional">Conventional</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Delivery Time"
                        value={currentProduct.deliveryTime || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, deliveryTime: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ style: { color: mode === 'dark' ? 'white' : 'black' } }} // Label color adjustment
                        InputProps={{
                            style: {
                                color: mode === 'dark' ? 'white' : 'black',
                                backgroundColor: mode === 'dark' ? '#616161' : 'white',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions style={{ backgroundColor: mode === 'dark' ? '#424242' : theme.palette.primary.main }}>
                    <Button onClick={() => setOpenDialog(false)}  variant="contained"
                                        color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveProduct} variant="contained"
                                        color="secondary">
                        {isEditing ? "Save Changes" : "Add Product"}
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );

};

export default FarmerPage;
