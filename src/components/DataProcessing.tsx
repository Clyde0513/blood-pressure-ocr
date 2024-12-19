"use client";
import React from 'react';
import { processOcrData } from '../lib/data-processing';
import { BloodPressureData } from '@/types';

interface Props {
    ocrResults: string[];
    onDataProcessed: (data: BloodPressureData[]) => void;
}

const DataProcessing: React.FC<Props> = ({ ocrResults, onDataProcessed }) => {
    const handleProcessData = () => {
        const data = processOcrData(ocrResults);
        onDataProcessed(data);
    };

    return (
        <div>
            <h2>Process Blood Pressure Data</h2>
            <button 
                onClick={handleProcessData}
                disabled={ocrResults.length === 0}
            >
                Process Data
            </button>
            {ocrResults.length > 0 && (
                <div className="mt-4">
                    <h3>OCR Results:</h3>
                    <ul>
                        {ocrResults.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DataProcessing;