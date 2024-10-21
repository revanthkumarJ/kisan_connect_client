import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Box, IconButton, CircularProgress } from '@mui/material';

// Custom Arrows (without text)
const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
        <IconButton
            sx={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                },
            }}
            onClick={onClick}
        >
            &lt;
        </IconButton>
    );
};

const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <IconButton
            sx={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                },
            }}
            onClick={onClick}
        >
            &gt;
        </IconButton>
    );
};

// Carousel Component
const Carousel = () => {
    const [carouselImages, setCarouselImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredImage, setHoveredImage] = useState(null); // Track the hovered image

    useEffect(() => {
        // Fetch images from API
        const fetchCarouselImages = async () => {
            try {
                const response = await axios.get('http://localhost:3000/customer/getAllCarousels');
                setCarouselImages(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching carousel images:', error);
                setLoading(false);
            }
        };

        fetchCarouselImages();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        fade: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };

    const slideStyle = {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
        position: 'relative', // Ensure the overlay is positioned correctly
    };

    const overlayStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        opacity: hoveredImage !== null ? 1 : 0,
        transition: 'opacity 0.3s ease', // Smooth transition for hover effect
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ position: 'relative', margin: 0, padding: 0, width: '100%', overflow: 'hidden', backgroundColor: 'black' }}>
            <Slider {...settings}>
                {carouselImages.map((image, index) => (
                    <Box
                        key={index}
                        onMouseEnter={() => setHoveredImage(index)} // Set hovered image on mouse enter
                        onMouseLeave={() => setHoveredImage(null)} // Reset hovered image on mouse leave
                        style={{ position: 'relative' }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${image.image}`}
                            alt={`Slide ${index + 1}`}
                            style={slideStyle}
                        />
                        <div style={{ ...overlayStyle, opacity: hoveredImage === index ? 1 : 0 }}>
                            {image.title} {/* Assuming image has a title property */}
                        </div>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
