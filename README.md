# README.md

# Blood Pressure OCR

This project is a Next.js application designed to convert unorganized blood pressure data using Optical Character Recognition (OCR) tools. It provides a user-friendly interface for uploading images, processing the data, and displaying the results in an organized format.

## Features

- Upload images containing blood pressure data for OCR processing.
- Display processed blood pressure data in a clear and user-friendly manner.
- Utilize OCR tools to extract text from images.
- Organize and format the extracted data for easy interpretation.

## Project Structure

```
blood-pressure-ocr
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components
│   │   ├── OcrUpload.tsx
│   │   ├── DataDisplay.tsx
│   │   └── DataProcessing.tsx
│   ├── lib
│   │   ├── ocr.ts
│   │   └── data-processing.ts
│   └── types
│       └── index.ts
├── public
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blood-pressure-ocr
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To run the application, use the following command:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.