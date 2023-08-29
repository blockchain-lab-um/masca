import { ChangeEvent, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from '../Button';

interface UploadButtonProps {
  acceptedMedia?: string;
  handleUpload: (file: File) => Promise<void | null>;
}

const UploadButton = ({
  handleUpload,
  acceptedMedia = 'image',
}: UploadButtonProps) => {
  const t = useTranslations('UploadButton');
  const [loading, setLoading] = useState<boolean>(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleFocusBack = () => {
    setLoading(false);
    window.removeEventListener('focus', handleFocusBack);
  };

  const handleClick = async () => {
    window.addEventListener('focus', handleFocusBack);
    setLoading(true);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    window.removeEventListener('focus', handleFocusBack);
    if (!e?.target?.files?.[0]) {
      setLoading(false);
      return;
    }

    await handleUpload(e.target.files[0]);
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        loading={loading}
        showTextOnLoading={false}
        onClick={handleClick}
      >
        {t('import')}
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        accept={acceptedMedia}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default UploadButton;
