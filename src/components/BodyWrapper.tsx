"use client";

import React from 'react';

const BodyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default BodyWrapper;
