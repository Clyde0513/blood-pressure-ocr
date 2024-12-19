interface BloodPressureReading {
    systolic: number;
    diastolic: number;
    date: string;
}

export const processOcrData = (ocrResults: string[]): BloodPressureReading[] => {
    // TODO: Implement actual OCR processing logic
    return ocrResults.map(result => {
        // This is a placeholder implementation
        // In reality, you'd need to parse the OCR text properly
        return {
            systolic: 120, // placeholder
            diastolic: 80, // placeholder
            date: new Date().toISOString(),
        };
    });
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
