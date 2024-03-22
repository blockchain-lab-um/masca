'use client';

import { Html5Qrcode, type Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { useToastStore } from '@/stores';

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
          link: null,
        });
      }, 200);
      setOpen(false);
    }

    return () => {
      setScanner(null);
    };
  }, []);

  useEffect(() => {
    if (scanner && !scanner.isScanning) {
      const config: Html5QrcodeCameraScanConfig = {
        fps: 60,
        qrbox: { width: 200, height: 200 },
      };

      scanner
        .start(
          { facingMode: 'environment' },
          config,
          (decodedText, _) => {
            onScanSuccess(decodedText, _);
            if (scanner?.isScanning) {
              scanner.stop().catch((error) => console.error(error));
            }
          },
          onScanFailure
        )
        .catch((e) => {
          setTimeout(() => {
            useToastStore.setState({
              open: true,
              title: t('starting-error'),
              type: 'error',
              loading: false,
              link: null,
            });
          }, 200);
          setOpen(false);
        });
    }
    return () => {
      if (scanner?.isScanning) {
        setScanner(null);
      }
    };
  }, [scanner]);

  return (
    <div className="mt-4 flex flex-col items-center">
      <div id="reader" className="w-full" />
    </div>
  );
};

export default QRCodeScanner;
