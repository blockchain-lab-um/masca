import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import GoogleDriveButton from '@/components/GoogleDriveButton';

export const GoogleBackupForm = () => (
  <div className="mt-4 flex space-x-2">
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}
    >
      <GoogleDriveButton buttonText="Save to Google Drive" action="backup" />
      <GoogleDriveButton
        buttonText="Import from Google Drive"
        action="import"
      />
    </GoogleOAuthProvider>
  </div>
);
