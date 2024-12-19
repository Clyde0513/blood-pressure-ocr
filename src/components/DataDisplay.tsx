import React from 'react';

interface BloodPressureData {
    systolic: number;
    diastolic: number;
    date: string;
}

interface DataDisplayProps {
    data: BloodPressureData[];
}

const DataDisplay: React.FC<DataDisplayProps> = ({ data }) => {
    return (
        <div>
            <h2>Blood Pressure Data</h2>
            {data.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Systolic (mmHg)</th>
                            <th>Diastolic (mmHg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.systolic}</td>
                                <td>{entry.diastolic}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default DataDisplay;