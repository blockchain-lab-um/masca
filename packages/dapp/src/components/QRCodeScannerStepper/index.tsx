import React, { useEffect, useMemo, useState } from 'react';
import { requestToBodyStream } from 'next/dist/server/body-streams';
import { CheckIcon } from '@heroicons/react/24/solid';
import { VerifiableCredential } from '@veramo/core';
import clsx from 'clsx';
import { useStepper } from 'headless-stepper';

import { useGeneralStore, useSessionStore } from '@/stores';
import Button from '../Button';
import { ChooseDeviceView } from './ChooseDeviceView';
import { ConnectDeviceView } from './ConnectDeviceView';
import { CredentialView } from './CredentialView';
import { ScanQRCodeView } from './ScanQRCodeView';
import { StartFlowView } from './StartFlowView';

const QRCodeScannerStepper = () => {
  const steps = useMemo(
    () => [
      {
        label: 'First Step',
        description: 'Choose Device Type',
        step: 0,
      },
      {
        label: 'Second Step',
        description: 'Connect Device',
        step: 1,
        hasPreviousStep: true,
      },
      {
        label: 'Third Step',
        description: 'Scan QR Code',
        step: 2,
        hasPreviousStep: true,
      },
      { label: 'Fourth Step', description: 'Start Flow', step: 3 },
      { label: 'Fifth Step', description: 'Flow Complete', step: 4 },
    ],
    []
  );

  const [credential, setCredential] = useState<VerifiableCredential>();

  const stepperInstance = useStepper({ steps });
  const isConnected = useGeneralStore((state) => state.isConnected);

  const { request, session, changeRequest, changeSession } = useSessionStore(
    (state) => ({
      request: state.request,
      session: state.session,
      changeRequest: state.changeRequest,
      changeSession: state.changeSession,
    })
  );

  useEffect(() => {
    if (session.connected && stepperInstance.state.currentStep === 1) {
      console.log('Session connected');
      stepperInstance.setStep(2);
    }
  }, [session.connected]);

  useEffect(() => {
    if (
      isConnected &&
      stepperInstance.state.currentStep === 2 &&
      (request.type === 'polygonAuth' ||
        request.type === 'credentialOffer' ||
        request.type === 'polygonCredentialOffer' ||
        request.type === 'oidcAuth')
    ) {
      stepperInstance.nextStep();
    }
  }, [request]);

  useEffect(() => {
    if (session.deviceType === null) {
      stepperInstance.setStep(0);
      if (session.connected && session.exp && session.exp > Date.now()) {
        stepperInstance.setStep(2);
        if (request.active) {
          stepperInstance.setStep(3);
          if (request.finished) {
            stepperInstance.setStep(4);
          }
        }
      }
    }
  }, []);

  const onQRCodeScanned = () => {
    console.log('QR Code scanned');
    stepperInstance.nextStep();
  };

  const scanNewCode = () => {
    stepperInstance.setStep(2);
  };

  const onDeviceTypeSelected = (
    deviceType: 'primary' | 'secondary',
    hasCamera: boolean
  ) => {
    if (deviceType === 'primary' && hasCamera) {
      changeSession({
        connected: true,
        sessionId: null,
        key: null,
        exp: null,
        deviceType,
        hasCamera,
      });

      stepperInstance.setStep(2);
    } else {
      changeSession({
        connected: false,
        sessionId: null,
        key: null,
        exp: null,
        deviceType,
        hasCamera,
      });

      stepperInstance.nextStep();
    }
  };

  const onCredentialReceived = (recievedCredential: VerifiableCredential) => {
    console.log('Credential recieved', credential);
    setCredential(recievedCredential);
    stepperInstance.setStep(4);
  };

  return (
    <div className="w-full">
      <div>
        <nav
          className="flex justify-between gap-x-2"
          {...stepperInstance.stepperProps}
        >
          {stepperInstance.stepsProps?.map((_, index) => (
            <>
              {index < 4 && (
                <ol
                  key={index}
                  className={clsx(
                    index + 2 < stepperInstance.state.totalSteps && 'grow'
                  )}
                >
                  <div className="flex items-center justify-start">
                    <div>
                      <div
                        className={clsx(
                          'dark:border-orange-accent-dark flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-500 text-xl font-bold text-pink-500 md:h-10 md:w-10',
                          index > stepperInstance.state.currentStep &&
                            'dark:text-orange-accent-dark',
                          index < stepperInstance.state.currentStep &&
                            'dark:bg-orange-accent-dark dark:text-navy-blue-800 bg-pink-500 text-white',
                          index === stepperInstance.state.currentStep &&
                            'dark:text-orange-accent-dark dark:bg-orange-accent-dark/20 bg-pink-50'
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
                      <div className="dark:text-navy-blue-400 text-xs font-thin text-gray-400 md:text-sm">
                        {steps[index].description}
                      </div>
                    </div>
                    {stepperInstance.state.totalSteps > index + 2 && (
                      <div className="grow">
                        <hr
                          className={clsx(
                            'ml-2 rounded-full border-2',
                            stepperInstance.state.currentStep === index + 1 &&
                              'dark:text-orange-accent-dark/40 text-pink-200',
                            stepperInstance.state.currentStep > index &&
                              'dark:text-orange-accent-dark text-pink-500',
                            stepperInstance.state.currentStep < index + 1 &&
                              'dark:text-navy-blue-600 text-gray-200'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </ol>
              )}
            </>
          ))}
        </nav>
      </div>
      <div className="mb-16 mt-16 p-4">
        {stepperInstance.state.currentStep === 0 && (
          <ChooseDeviceView onDeviceTypeSelected={onDeviceTypeSelected} />
        )}
        {stepperInstance.state.currentStep === 1 && <ConnectDeviceView />}
        {stepperInstance.state.currentStep === 2 && (
          <ScanQRCodeView onQRCodeScanned={onQRCodeScanned} />
        )}
        {stepperInstance.state.currentStep === 3 && (
          <StartFlowView
            scanNewCode={scanNewCode}
            onCredentialRecieved={onCredentialReceived}
          />
        )}
        {stepperInstance.state.currentStep === 4 && (
          <CredentialView credential={credential!} scanNewCode={scanNewCode} />
        )}
      </div>
      {steps[stepperInstance.state.currentStep].hasPreviousStep && (
        <div className="flex justify-end p-4">
          {stepperInstance.state.currentStep === 1 &&
            session.connected &&
            session.exp &&
            session.exp > Date.now() && (
              <div className="mr-2">
                <Button
                  variant="done"
                  size="xs"
                  onClick={stepperInstance.nextStep}
                >
                  Use existing session
                </Button>
              </div>
            )}
          <Button variant="done" size="xs" onClick={stepperInstance.prevStep}>
            Back
          </Button>
        </div>
      )}
      {stepperInstance.state.currentStep === 3 && (
        <div className="flex justify-end p-4">
          <Button
            variant="done"
            size="xs"
            onClick={() => {
              changeRequest({
                active: false,
                data: null,
                type: null,
                finished: false,
              });
              scanNewCode();
            }}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRCodeScannerStepper;
