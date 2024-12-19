// src/types/index.ts

export interface BloodPressureData {
    systolic: number;
    diastolic: number;
    date: string;
    notes?: string;
}

export interface OcrResult {
    text: string;
    confidence: number;
}

export interface ProcessedData {
    bloodPressureReadings: BloodPressureData[];
    summary: string;
}