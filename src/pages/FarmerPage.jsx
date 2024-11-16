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
    const { mode } = useAuth();
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
        setIsEditing(!!product);
        setCurrentProduct(product || {});
        setOpenDialog(true);
    };

    const base64ToBlob = (base64, mimeType) => {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeType });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setCurrentProduct((prevProduct) => ({ ...prevProduct, image: file }));
    }
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
        formData.append("image", currentProduct.image);

        
        

        try {
            if (isEditing) {
                formData.append("id", currentProduct._id);
                
                await axios.put("http://localhost:3000/farmer/product/editproduct", formData, {
                    headers: { "auth-token": token, "Content-Type": "multipart/form-data" },
                });
                setSnackbarMessage('Product updated successfully!');
            } else {
                await axios.post("http://localhost:3000/farmer/product/addproduct", formData, {
                    headers: { "auth-token": token, "Content-Type": "multipart/form-data" },
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
        <div style={{ minHeight:"100vh",padding: "20px", backgroundColor: mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100], color: mode === 'dark' ? 'white' : 'black' }}>
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
                                sx={{height:"400px"}}
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
                                    <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenDialog(product)} style={{ marginRight: '10px' }}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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
                />

                {/* Category dropdown */}
                <Select
                    label="Category"
                    value={currentProduct.category || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    fullWidth
                    margin="normal"
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select Category</MenuItem>
                    {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Others'].map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>

                <TextField
                    label="Description"
                    value={currentProduct.description || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />

                <TextField
                    label="Price"
                    type="number"
                    value={currentProduct.price || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                    fullWidth
                    margin="normal"
                />

                {/* Unit dropdown */}
                <Select
                    label="Unit"
                    value={currentProduct.unit || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                    fullWidth
                    margin="normal"
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select Unit</MenuItem>
                    {['kg', 'liter', 'dozen', 'unit'].map((unit) => (
                        <MenuItem key={unit} value={unit}>
                            {unit}
                        </MenuItem>
                    ))}
                </Select>

                <TextField
                    label="Stock"
                    type="number"
                    value={currentProduct.stock || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Harvest Date"
                    type="date"
                    value={currentProduct.harvestDate || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, harvestDate: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Expiry Date"
                    type="date"
                    value={currentProduct.expiryDate || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, expiryDate: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                {/* Farming Method dropdown */}
                <Select
                    label="Farming Method"
                    value={currentProduct.farmingMethod || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, farmingMethod: e.target.value })}
                    fullWidth
                    margin="normal"
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select Farming Method</MenuItem>
                    {['Organic', 'Traditional', 'Hydroponic', 'Others'].map((method) => (
                        <MenuItem key={method} value={method}>
                            {method}
                        </MenuItem>
                    ))}
                </Select>

                <TextField
                    label="Delivery Time"
                    value={currentProduct.deliveryTime || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, deliveryTime: e.target.value })}
                    fullWidth
                    margin="normal"
                />


                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>handleImageChange(e)}
                    style={{ marginTop: '15px', display: 'block' }}
                />
            </DialogContent>
            <DialogActions style={{ backgroundColor: mode === 'dark' ? '#424242' : 'white' }}>
                <Button onClick={() => setOpenDialog(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSaveProduct} color="primary">
                    {isEditing ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default FarmerPage;
