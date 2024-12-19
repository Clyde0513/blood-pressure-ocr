import React from 'react';
import './globals.css';
import Footer from '@/components/Footer';
import ClientInitializer from '@/components/ClientInitializer';

export const metadata = {
  title: 'Blood Pressure OCR',
  description: 'Convert blood pressure readings using OCR technology',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientInitializer />
        <div className="layout">
          <header className="header">
            <h1>Blood Pressure OCR</h1>
          </header>
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;