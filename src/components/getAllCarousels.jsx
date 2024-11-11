import React from 'react';
import Button from '@mui/material/Button';

const GetAllCarousels = ({ carousel  ,onDelete  ,onEdit  }) => {
    return (

        <div className='w-6/12 m-auto bg-white shadow-md rounded-lg p-4 mb-5'>
        <div className="flex justify-between items-center  transition-transform hover:scale-105">
            <div className="w-9/12 pr-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1"><span className="text-bold">Title:</span>{carousel.title}</h3>
                <div className="flex gap-2 justify-center mt-10">
                <Button variant="contained" color="primary" onClick={() => onEdit(carousel._id || carousel.id)}> Edit</Button>

                    <Button variant="contained" color="secondary" onClick={() => onDelete(carousel._id || carousel.id)}>Delete</Button>
                </div>
                
            </div>

            <div className="w-3/12">
                <img
                    src={carousel.previewUrl || `data:image/jpeg;base64,${carousel.image}`}
                    alt="Carousel"
                    className="w-full h-auto rounded-md object-cover border border-gray-200"
                />
            </div>
            
        </div>
       
        </div>
    );
};

export default GetAllCarousels;
