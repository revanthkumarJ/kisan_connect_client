


import React, { useState, useRef } from 'react';

const BecomeSeller = () => {
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [experience, setExperience] = useState('');
  const [farmPhoto, setFarmPhoto] = useState(null);
  const [proofPhoto, setProofPhoto] = useState(null);

  // Create refs for the file inputs
  const farmPhotoInputRef = useRef(null);
  const proofPhotoInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      farmLocation,
      farmSize,
      experience,
      farmPhoto,
      proofPhoto,
    });
  };

  // Handles the file input and shows the selected image with the ability to remove it
  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Removes the selected image and clears the file input to prevent caching
  const handleRemoveImage = (setImage, inputRef) => {
    setImage(null);
    inputRef.current.value = ''; // Reset file input value to clear cache
  };

  // Handle integer-only inputs for experience and farm size
  const handleIntegerChange = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {  // Ensure only numbers (no decimals or negative)
      setter(value);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h4 style={styles.header}>Become a Seller</h4>
        <form onSubmit={handleSubmit}>
          
          {/* Farm Location */}
          <div style={styles.field}>
            <input
              type="text"
              placeholder="Farm Location"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Farm Size */}
          <div style={styles.field}>
            <input
              type="number"
              placeholder="Farm Size (in acres)"
              value={farmSize}
              onChange={(e) => handleIntegerChange(e, setFarmSize)} // Ensure only integer input
              required
              style={styles.input}
            />
          </div>

          {/* Experience */}
          <div style={styles.field}>
            <input
              type="number"
              placeholder="Experience (in years)"
              value={experience}
              onChange={(e) => handleIntegerChange(e, setExperience)} // Ensure only integer input
              required
              style={styles.input}
            />
          </div>

          {/* Farm Photo */}
          <div style={styles.field}>
            <label htmlFor="farmPhoto" style={styles.label}>
              Upload Farm Photo (Accepted formats: jpg, jpeg, png):
            </label>
            <input
              type="file"
              id="farmPhoto"
              ref={farmPhotoInputRef} // Use ref for farmPhoto input
              accept="image/jpeg, image/png"
              onChange={(e) => handleImageChange(e, setFarmPhoto)}
              style={styles.input}
            />
            {farmPhoto && (
              <div style={styles.imagePreviewContainer}>
                <img src={farmPhoto} alt="Farm" style={styles.imagePreview} />
                <button
                  type="button"
                  style={styles.removeButton}
                  onClick={() => handleRemoveImage(setFarmPhoto, farmPhotoInputRef)}
                >
                  X
                </button>
              </div>
            )}
          </div>

          {/* Proof Photo */}
          <div style={styles.field}>
            <label htmlFor="proofPhoto" style={styles.label}>
              Upload Proof Photo (Accepted formats: jpg, jpeg, png):
            </label>
            <input
              type="file"
              id="proofPhoto"
              ref={proofPhotoInputRef} // Use ref for proofPhoto input
              accept="image/jpeg, image/png"
              onChange={(e) => handleImageChange(e, setProofPhoto)}
              style={styles.input}
            />
            {proofPhoto && (
              <div style={styles.imagePreviewContainer}>
                <img src={proofPhoto} alt="Proof" style={styles.imagePreview} />
                <button
                  type="button"
                  style={styles.removeButton}
                  onClick={() => handleRemoveImage(setProofPhoto, proofPhotoInputRef)}
                >
                  X
                </button>
              </div>
            )}
          </div>

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem',
    backgroundColor: '#f0f4f8',
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  field: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  imagePreviewContainer: {
    position: 'relative',
    display: 'inline-block',
    marginTop: '1rem',
  },
  imagePreview: {
    width: '100%',
    maxWidth: '200px',
    borderRadius: '8px',
  },
  removeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    cursor: 'pointer',
  },
};

export default BecomeSeller;
