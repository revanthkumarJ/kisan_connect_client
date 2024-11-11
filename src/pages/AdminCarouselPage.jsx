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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminCarouselPage = () => {
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
        formData.append("image", newCarousel.image);

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
            if (newCarousel.image) {
                formData.append("image", newCarousel.image);
            }
    
            const response = await axios.put("http://localhost:3000/admin/carousel/editcarousel", formData, {
                headers: {
                    'auth-token': token,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            const updatedCarousel = response.data.carouselItem;
    
            if (updatedCarousel) {
                setCarousels(prevCarousels => 
                    prevCarousels.map(carousel => 
                        carousel._id === updatedCarousel._id ? updatedCarousel : carousel
                    )
                );
    
                // Close the dialog and show success message
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

    return (
        <div className="text-center font-bold text-lg my-5">
            <div className="flex justify-between items-center px-5">
                <div className="font-bold text-xl ml-[35rem]">
                    Manage Carousels
                </div>
                <Stack spacing={2} direction="row">
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Add Carousel
                    </Button>
                </Stack>
            </div>

            {
                carousels.map((carousel) => (
                    <GetAllCarousels 
                        key={carousel.id || carousel._id} 
                        carousel={carousel} 
                        onDelete={handleDeleteCarousel} 
                        onEdit={() => handleOpenDialog(carousel)}
                    />
                ))
            }

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{editingCarouselId ? "Edit Carousel" : "Add New Carousel"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
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
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ marginTop: '20px' }}
                    />
                    {newCarousel.previewUrl && (
                        <img src={newCarousel.previewUrl} alt="Image Preview" style={{ marginTop: '10px', maxWidth: '100%' }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={editingCarouselId ? handleEditCarousel : handleSaveCarousel}>
                        {editingCarouselId ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AdminCarouselPage;
