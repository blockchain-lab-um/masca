import React, { useEffect, useMemo, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useStepper } from 'headless-stepper';

import { useGeneralStore, useSessionStore } from '@/stores';
import { ChooseDeviceView } from './ChooseDeviceView';
import { ConnectDeviceView } from './ConnectDeviceView';
import { ScanQRCodeView } from './ScanQRCodeView';

export const QRCodeScannerStepper = () => {
  const steps = useMemo(
    () => [
      {
        label: 'First Step',
        description: 'Choose Device Type',
        step: 0,
      },
      { label: 'Second Step', description: 'Connect Device', step: 1 },
      { label: 'Third Step', description: 'Scan QR Code', step: 2 },
      { label: 'Fourth Step', description: 'Start Flow', step: 3 },
    ],
    []
  );

  const stepperInstance = useStepper({ steps });
  const isConnected = useGeneralStore((state) => state.isConnected);
  const secondaryDeviceConnected = useSessionStore((state) => state.connected);
  const [deviceType, setDeviceType] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (secondaryDeviceConnected && stepperInstance.state.currentStep === 1) {
      stepperInstance.nextStep();
    }
  }, [secondaryDeviceConnected]);

  const onConnectDevice = () => {
    stepperInstance.nextStep();
  };

  const onSetDeviceType = (type: string) => {
    setDeviceType(type);
    stepperInstance.nextStep();
  };

  return (
    <div className="w-full">
      <div>
        <nav
          className="flex justify-between gap-x-2"
          {...stepperInstance.stepperProps}
        >
          {stepperInstance.stepsProps?.map((step, index) => (
            <ol
              key={index}
              className={`${
                index + 1 < stepperInstance.state.totalSteps && 'grow'
              }`}
            >
              <div className="flex items-center justify-start">
                <div>
                  <div
                    className={clsx(
                      `dark:border-orange-accent-dark  flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-500 text-xl font-bold text-pink-500 md:h-10 md:w-10`,
                      `${
                        index > stepperInstance.state.currentStep &&
                        'dark:text-orange-accent-dark'
                      }`,
                      `${
                        index < stepperInstance.state.currentStep &&
                        'dark:bg-orange-accent-dark dark:text-navy-blue-800 bg-pink-500 text-white'
                      }`,
                      `${
                        index === stepperInstance.state.currentStep &&
                        'dark:text-orange-accent-dark dark:bg-orange-accent-dark/20 bg-pink-50'
                      }`
                    )}
                  >
                    {index < stepperInstance.state.currentStep ? (
                      <CheckIcon className="h-6 w-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                <div className="md:text-md ml-2 hidden text-sm sm:block">
                  <div className="font-semibold">{steps[index].label}</div>
                  <div className=" dark:text-navy-blue-400 text-xs font-thin text-gray-400 md:text-sm">
                    {steps[index].description}
                  </div>
                </div>
                {stepperInstance.state.totalSteps > index + 1 && (
                  <div className="grow">
                    <hr
                      className={clsx(
                        ' ml-2 rounded-full border-2',
                        `${
                          stepperInstance.state.currentStep === index + 1 &&
                          'dark:text-orange-accent-dark/40 text-pink-200'
                        }`,
                        `${
                          stepperInstance.state.currentStep > index &&
                          'dark:text-orange-accent-dark text-pink-500'
                        }`,
                        `${
                          stepperInstance.state.currentStep < index + 1 &&
                          'dark:text-navy-blue-600 text-gray-200'
                        }`
                      )}
                    />
                  </div>
                )}
              </div>
            </ol>
          ))}
        </nav>
      </div>
      <div className="p-4">
        {stepperInstance.state.currentStep === 0 && (
          <ChooseDeviceView setDeviceType={onSetDeviceType} />
        )}
        {stepperInstance.state.currentStep === 1 && (
          <ConnectDeviceView deviceType={deviceType!} />
        )}
        {stepperInstance.state.currentStep === 2 && (
          <ScanQRCodeView deviceType={deviceType!} />
        )}
      </div>
      <p>Current step: {stepperInstance.state.currentStep}</p>
      <button
        onClick={stepperInstance.prevStep}
        disabled={!stepperInstance.state.hasPreviousStep}
      >
        Prev
      </button>
      <button onClick={stepperInstance.nextStep}>Next</button>
      <div {...stepperInstance.progressProps} />
    </div>
  );
};
