import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import MetaMaskConfig from './MetaMaskConfig';

function getLibrary(provider) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return new Web3Provider(provider);
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#a495ff',
      light: '#8349bb',
      dark: '#8349bb',
    },
    secondary: {
      main: '#8349bb',
      light: '#a495ff',
      dark: '#3b3b3b',
    },
  },
});
export default function MetaMaskConfigRoot() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <MetaMaskConfig />
      </ThemeProvider>
    </Web3ReactProvider>
  );
}
