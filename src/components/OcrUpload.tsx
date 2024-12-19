"use client";
import React, { useState } from 'react';


const OcrUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            // Logic to handle OCR processing will go here
            console.log('File uploaded:', file);
        }
    };

    return (
        <div className="ocr-upload">
            <h2>Upload Blood Pressure Data Image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
        </div>
    );
};

export default OcrUpload;