'use client';

import { useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';

import { useToastStore } from '@/stores';

type QRCodeScannerProps = {
  onScanSuccess: (decodedText: string, _: any) => void;
  scanner: Html5Qrcode | null;
  setScanner: (scanner: Html5Qrcode | null) => void;
  setOpen: (open: boolean) => void;
};

const QRCodeScanner = ({
  onScanSuccess,
  scanner,
  setScanner,
  setOpen,
}: QRCodeScannerProps) => {
  const onScanFailure = (_: any) => {};

  useEffect(() => {
    try {
      setScanner(
        new Html5Qrcode('reader', {
          verbose: false,
        })
      );
    } catch (error) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: 'Error initializing QR Code Scanner',
          type: 'error',
          loading: false,
        });
      }, 200);
      setOpen(false);
    }

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!scanner) return;

    const config: Html5QrcodeCameraScanConfig = {
      fps: 30,
      qrbox: { width: 200, height: 200 },
    };

    scanner
      .start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanFailure
      )
      .catch(() => {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: 'Error starting QR Code Scanner',
            type: 'error',
            loading: false,
          });
        }, 200);
        setOpen(false);
      });
  }, [scanner]);

  return (
    <div className="mt-4">
      <div id="reader" className="w-full" />
    </div>
  );
};

export default QRCodeScanner;
