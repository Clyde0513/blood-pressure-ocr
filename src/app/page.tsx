"use client";
import React, { useState } from 'react';
import OcrUpload from '@/components/OcrUpload';
import DataProcessing from '@/components/DataProcessing';
import DataDisplay from '@/components/DataDisplay';
import { BloodPressureData } from '@/types';

const Page: React.FC = () => {
    const [ocrResults, setOcrResults] = useState<string[]>([]);
    const [processedData, setProcessedData] = useState<BloodPressureData[]>([]);

    const handleOcrComplete = (results: string[]) => {
        console.log('OCR Results received:', results);
        setOcrResults(results);
    };

    const handleDataProcessed = (data: BloodPressureData[]) => {
        console.log('Data processed:', data);
        setProcessedData(data);
    };

    return (
        <div className="container">
            <section className="upload-section">
                <OcrUpload onOcrComplete={(results) => handleOcrComplete(results)} />
            </section>
            <section className="processing-section">
                <DataProcessing 
                    ocrResults={ocrResults}
                    onDataProcessed={handleDataProcessed}
                />
            </section>
            <section className="display-section">
                <DataDisplay data={processedData} />
            </section>
        </div>
    );
};

export default Page;