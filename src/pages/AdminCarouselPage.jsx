import { useEffect, useState } from "react";
import axios from 'axios';
import GetAllCarousels from "../components/getAllCarousels.jsx";
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useAuth} from "./AuthContext.js";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminCarouselPage = () => {
    const { mode } = useAuth();
    const [carousels, setCarousels] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCarousel, setNewCarousel] = useState({
        title: '',
        image: null,
        previewUrl: null,
        createdAt: new Date().toISOString()
    });
    const [editingCarouselId, setEditingCarouselId] = useState(null);
    const [previouslyFocusedElement, setPreviouslyFocusedElement] = useState(null);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch carousels when component mounts
    const fetchCarousels = async () => {
        try {
            const response = await axios.get("http://localhost:3000/customer/getAllCarousels");
            const carouselData = response.data;
            setCarousels(carouselData);
        } catch (error) {
            console.log("Error fetching carousels", error);
        }
    };

    useEffect(() => {
        fetchCarousels();
    }, []);

    const handleOpenDialog = (carousel = null) => {
        if (carousel) {
            setEditingCarouselId(carousel._id); // Set the ID of the carousel being edited
            setNewCarousel({
                title: carousel.title,
                image: null,
                previewUrl: `data:image/jpeg;base64,${carousel.image}`,
                createdAt: carousel.createdAt
            });
        } else {
            setEditingCarouselId(null); // Reset for new carousel
            setNewCarousel({
                title: '',
                image: null,
                previewUrl: null,
                createdAt: new Date().toISOString()
            });
        }

        setPreviouslyFocusedElement(document.activeElement);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewCarousel({
            title: '',
            image: null,
            previewUrl: null,
            createdAt: new Date().toISOString()
        });
        setEditingCarouselId(null);

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCarousel(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewCarousel(prevState => ({
                ...prevState,
                image: file,
                previewUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleSaveCarousel = async () => {
        const formData = new FormData();
        formData.append("title", newCarousel.title);
        
        if (newCarousel.image) {
            formData.append("image", newCarousel.image);
        } else {
            console.warn("Image file is empty.");
        }
    
        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
    
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/admin/carousel/addcarousel", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'auth-token': token
                }
            });
    
            const savedCarousel = response.data.carouselItem;
    
            if (savedCarousel) {
                const newCarouselData = {
                    ...savedCarousel,
                    previewUrl: newCarousel.previewUrl,
                    createdAt: savedCarousel.createdAt
                };
    
                setCarousels(prevCarousels => [...prevCarousels, newCarouselData]);
                handleCloseDialog();
                setSnackbarMessage('Carousel added successfully!');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error saving carousel:", error);
        }
    };
    
    const handleEditCarousel = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("id", editingCarouselId);
            formData.append("title", newCarousel.title);
    
            // Only append the image if there is a new one uploaded
            if (newCarousel.image) {
                formData.append("image", newCarousel.image);
            }
    
            // Log FormData contents to check if data is being appended correctly
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            const response = await axios.put("http://localhost:3000/admin/carousel/editcarousel", formData, {
                headers: {
                    'auth-token': token,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            const updatedCarousel = response.data.carouselItem;
    
            if (updatedCarousel) {
                // Merge preview URL if needed
                const updatedCarouselWithPreview = {
                    ...updatedCarousel,
                    previewUrl: newCarousel.previewUrl,
                };
    
                // Update carousels list with the edited carousel
                setCarousels(prevCarousels =>
                    prevCarousels.map(carousel =>
                        carousel._id === updatedCarousel._id ? updatedCarouselWithPreview : carousel
                    )
                );
    
                // Close dialog and show success message
                handleCloseDialog();
                setSnackbarMessage('Carousel updated successfully!');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.log("Error editing the carousel:", error);
        }
    };
    

    const handleDeleteCarousel = async (carouselId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete("http://localhost:3000/admin/carousel/deletecarousel", {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json'
                },
                data: { id: carouselId }
            });

            setCarousels(prevCarousels => prevCarousels.filter(carousel => carousel._id !== carouselId));
            setSnackbarMessage('Carousel deleted successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.log("Error deleting the carousel", error);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Light and dark mode styles
    const containerStyle = {
        backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
        color: mode === 'light' ? '#000' : '#fff',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',  // Aligning items in column layout
    };

    const dialogStyle = {
        backgroundColor: mode === 'light' ? '#fff' : '#333',
        color: mode === 'light' ? '#000' : '#fff',
    };

    const buttonStyle = {
        backgroundColor: mode === 'light' ? '#1976d2' : '#90caf9',
        color: '#fff',
    };

    return (
        <div style={containerStyle}>
            <div className="flex justify-between items-center px-5" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div className="font-bold text-xl" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Manage Carousels
                </div>
                <Button variant="contained" style={buttonStyle} onClick={() => handleOpenDialog()}>
                    Add Carousel
                </Button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {carousels.map((carousel) => (
                    <GetAllCarousels
                        key={carousel.id || carousel._id}
                        carousel={carousel}
                        onDelete={handleDeleteCarousel}
                        onEdit={() => handleOpenDialog(carousel)}
                    />
                ))}
            </div>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} PaperProps={{ style: dialogStyle }}>
                <DialogTitle>{editingCarouselId ? "Edit Carousel" : "Add New Carousel"}</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: dialogStyle.color }}>
                        Please fill out the details for the carousel.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        name="title"
                        value={newCarousel.title}
                        onChange={handleInputChange}
                        InputLabelProps={{ style: { color: dialogStyle.color } }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ marginTop: '20px' }}
                    />
                    {newCarousel.previewUrl && (
                        <img
                            src={newCarousel.previewUrl}
                            alt="Preview"
                            style={{ width: '100%', marginTop: '10px' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={editingCarouselId ? handleEditCarousel : handleSaveCarousel}
                        color="primary"
                    >
                        {editingCarouselId ? 'Save Changes' : 'Add Carousel'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AdminCarouselPage;
