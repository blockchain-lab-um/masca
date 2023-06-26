'use client';

import { useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';

type QRCodeScannerProps = {
  onScanSuccess: (decodedText: string, _: any) => void;
  scanner: Html5Qrcode | null;
  setScanner: (scanner: Html5Qrcode | null) => void;
};

const QRCodeScanner = ({
  onScanSuccess,
  scanner,
  setScanner,
}: QRCodeScannerProps) => {
  const onScanFailure = (_: any) => {};

  useEffect(() => {
    setScanner(
      new Html5Qrcode('reader', {
        verbose: false,
      })
    );

    return () => {
      scanner?.stop().catch((error) => console.error(error));
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
      .catch((error) => console.error(error));
  }, [scanner]);

  return (
    <div className="mt-4">
      <div id="reader" className="w-full" />
    </div>
  );
};

export default QRCodeScanner;
