'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
    {children}
  </NextThemeProvider>
);

export default ThemeProvider;
