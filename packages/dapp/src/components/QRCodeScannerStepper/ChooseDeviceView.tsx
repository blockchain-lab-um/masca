import React from 'react';

interface ChooseDeviceViewProps {
  setDeviceType: (type: string) => void;
}

export const ChooseDeviceView = ({ setDeviceType }: ChooseDeviceViewProps) => (
  <div className="mt-4 flex w-full items-center justify-center gap-x-4">
    <button
      onClick={() => setDeviceType('camera')}
      className="flex flex-col rounded-xl border-2 border-gray-500 p-4"
    >
      <span className="font-medium">Device with QR scanning capabilities</span>
      <span className="text-sm">
        This device is capable of scanning OR uploading a screenshot of QR
        codes. This can be either primary device or a separate mobile device
      </span>
    </button>
    <button
      onClick={() => setDeviceType('no-camera')}
      className="flex flex-col rounded-xl border-2 border-gray-500 p-4"
    >
      <span className="font-medium">
        Device without QR scanning capabilities
      </span>
      <span className="text-sm">
        This is a desktop device. I will use a secondary (mobile) device for
        scanning/uploading QR codes
      </span>
    </button>
  </div>
);
