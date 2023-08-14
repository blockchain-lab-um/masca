import { ChangeEvent, useRef, useState } from 'react';

import Button from '../Button';

interface UploadButtonProps {
  acceptedMedia?: string;
  handleUpload: (file: File) => Promise<void | null>;
}

const UploadButton = ({
  handleUpload,
  acceptedMedia = 'image',
}: UploadButtonProps) => {
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
        loading={loading}
        showTextOnLoading={false}
        size="xs"
        onClick={handleClick}
      >
        Import
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
