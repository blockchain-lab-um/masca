'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextUIProvider>
    <NextThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
    >
      {children}
    </NextThemeProvider>
  </NextUIProvider>
);

export default ThemeProvider;
