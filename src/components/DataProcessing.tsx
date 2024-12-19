"use client";

import React, { useState } from 'react';
import { processOcrData } from '../lib/data-processing';

const DataProcessing: React.FC<{ ocrResults: string[] }> = ({ ocrResults }) => {
    const [processedData, setProcessedData] = useState<any[]>([]);

    const handleProcessData = () => {
        const data = processOcrData(ocrResults);
        setProcessedData(data);
    };

    return (
        <div>
            <h2>Processed Blood Pressure Data</h2>
            <button onClick={handleProcessData}>Process Data</button>
            {processedData.length > 0 && (
                <ul>
                    {processedData.map((data, index) => (
                        <li key={index}>{JSON.stringify(data)}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DataProcessing;