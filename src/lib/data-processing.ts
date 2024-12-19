import { BloodPressureData } from '@/types';

interface BloodPressureReading {
    systolic: number;
    diastolic: number;
    date: string;
}

export const processOcrData = (ocrResults: string[]): BloodPressureData[] => {
    return ocrResults
        .map(result => {
            try {
                // Try to extract blood pressure readings using regex
                const bpMatch = result.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
                if (!bpMatch) return null;

                const systolic = parseInt(bpMatch[1], 10);
                const diastolic = parseInt(bpMatch[2], 10);

                // Try to find a date in the string
                const dateMatch = result.match(/(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{2,4})/);
                const date = dateMatch 
                    ? `${dateMatch[1].padStart(2, '0')}/${dateMatch[2].padStart(2, '0')}/${dateMatch[3].slice(-2)}`
                    : new Date().toLocaleDateString('en-US', { 
                        month: '2-digit', 
                        day: '2-digit', 
                        year: '2-digit' 
                    });

                const reading = {
                    systolic,
                    diastolic,
                    date,
                    notes: 'Processed from OCR'
                };

                return validateReading(reading) ? reading : null;
            } catch (error) {
                console.error('Error processing reading:', error);
                return null;
            }
        })
        .filter((reading): reading is BloodPressureData => reading !== null);
};

export const validateReading = (reading: BloodPressureReading): boolean => {
    return (
        reading.systolic > 0 &&
        reading.systolic < 300 &&
        reading.diastolic > 0 &&
        reading.diastolic < 200 &&
        reading.systolic > reading.diastolic
    );
};
