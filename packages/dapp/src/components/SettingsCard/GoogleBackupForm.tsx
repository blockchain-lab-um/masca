import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslations } from 'next-intl';

import GoogleDriveButton from '@/components/GoogleDriveButton';

const GoogleBackupForm = () => {
  const t = useTranslations('SettingsCard');
  return (
    <div className="mt-4 flex space-x-2">
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}
      >
        <GoogleDriveButton buttonText={t('export-google')} action="backup" />
        <GoogleDriveButton buttonText={t('import-google')} action="import" />
        <GoogleDriveButton buttonText="Delete backup file" action="delete" />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleBackupForm;
