"use client";
import React, { useState } from 'react';
import { performOcr } from '../lib/ocr-service';

interface Props {
    onOcrComplete: (results: string[]) => void;
}

const OcrUpload: React.FC<Props> = ({ onOcrComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const results = await performOcr(file);
            
            if (results.length === 0) {
                alert('No blood pressure readings found in the image. Please try again with a clearer image.');
            } else {
                onOcrComplete(results);
            }
        } catch (error) {
            console.error('Chunker.ai Error:', error);
            alert('Error processing image. Please ensure you have a valid API key and try again.');
        } finally {
            setIsProcessing(false);
            setFile(null);
        }
    };

    return (
        <div className="ocr-upload">
            <h2>Upload Blood Pressure Data Image</h2>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={isProcessing} 
            />
            <button 
                onClick={handleUpload} 
                disabled={!file || isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Upload'}
            </button>
        </div>
    );
};

export default OcrUpload;