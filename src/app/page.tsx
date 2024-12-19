import React from 'react';
import OcrUpload from '@/components/OcrUpload';
import DataProcessing from '@/components/DataProcessing';
import DataDisplay from '@/components/DataDisplay';

const Page: React.FC = () => {
    return (
        <div className="container">
            <section className="upload-section">
                <OcrUpload />
            </section>
            <section className="processing-section">
                <DataProcessing ocrResults={[]} />
            </section>
            <section className="display-section">
                <DataDisplay data={[]} />
            </section>
        </div>
    );
};

export default Page;