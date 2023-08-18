'use client';

import { useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useTranslations } from 'next-intl';

import { useToastStore } from '@/stores';
import UploadButton from '../UploadButton';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string, _: any) => void;
  scanner: Html5Qrcode | null;
  setScanner: (scanner: Html5Qrcode | null) => void;
  setOpen: (open: boolean) => void;
}

const QRCodeScanner = ({
  onScanSuccess,
  scanner,
  setScanner,
  setOpen,
}: QRCodeScannerProps) => {
  const t = useTranslations('QRCodeScanner');
  const onScanFailure = (_: any) => {};

  useEffect(() => {
    console.log('setting scanner..');
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
          title: t('initialize-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
      console.log('error', error);
      console.log("closing modal because scanner couldn't be initialized");
      setOpen(false);
    }

    return () => {
      console.log('closing scanner useEffect closure!');
      if (scanner && scanner.isScanning) {
        console.log('SCANNER STOP 2');
        scanner.stop().catch((e) => {
          console.log(e);
        });
        console.log(scanner);
      }
    };
  }, []);

  useEffect(() => {
    console.log('scanner changed use effect');
    if (scanner) {
      console.log('setting scanner here');
      const config: Html5QrcodeCameraScanConfig = {
        fps: 30,
        qrbox: { width: 200, height: 200 },
      };

      console.log('starting scanner inside useEffect');
      scanner
        .start(
          { facingMode: 'environment' },
          config,
          onScanSuccess,
          onScanFailure
        )
        .catch((e) => {
          console.log('Error starting scanner or sth', e);
          setTimeout(() => {
            useToastStore.setState({
              open: true,
              title: t('starting-error'),
              type: 'error',
              loading: false,
            });
          }, 200);
        });
    }
    return () => {
      console.log('closing scanner useEffect closure 2222!');
      if (scanner && scanner.isScanning) {
        console.log('SCANNER STOP 2');
        scanner.stop().catch((e) => {
          console.log(e);
        });
        console.log(scanner);
      }
    };
  }, [scanner]);

  const handleUpload = async (file: File) => {
    try {
      if (!scanner) throw new Error("Scanner isn't initialized");
      if (scanner.isScanning) await scanner.stop();

      const decodedText = await scanner.scanFile(file, false);
      onScanSuccess(decodedText, null);
    } catch (error) {
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('qr-invalid-error'),
          type: 'error',
          loading: false,
        });
      }, 200);
    }

    console.log('closing modal');
    setOpen(false);
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <div id="reader" className="w-full" />
      <div className="pt-5">
        <UploadButton handleUpload={handleUpload} />
      </div>
    </div>
  );
};

export default QRCodeScanner;
