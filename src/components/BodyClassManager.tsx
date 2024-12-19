"use client";

import { useEffect } from 'react';

export default function BodyClassManager() {
  useEffect(() => {
    // Remove any existing class to prevent hydration mismatch
    document.body.className = '';
  }, []);

  return null;
}
