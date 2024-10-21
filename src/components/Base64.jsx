import React from 'react';

const Base64Image = ({ base64String, altText = 'Image' }) => {
  return (
    <img
      src={`data:image/jpeg;base64,${base64String}`}
      alt={altText}
      style={{ width: '100%', height: '200px' }} // You can adjust styling as needed
    />
  );
};

export default Base64Image;
