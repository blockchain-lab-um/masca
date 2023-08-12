'use client';

import { useState } from 'react';
import Link from 'next/link';
import { isError } from '@blockchain-lab-um/masca-connector';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { IVerifyResult } from '@veramo/core';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { useMascaStore, useToastStore } from '@/stores';
import Button from '../Button';

const VerifyDataDisplay = () => {
  const t = useTranslations('VerifyDataDisplay');
  const api = useMascaStore((state) => state.mascaApi);

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState({ checked: false, valid: false });

  const verifyData = async () => {
    if (!api) return;

    setLoading(true);

    let dataObj;
    try {
      dataObj = JSON.parse(data);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('toast.error-json'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    if (
      !dataObj.type ||
      (typeof dataObj.type !== 'string' && !Array.isArray(dataObj.type))
    ) {
      console.error('Wrong Data Type');
      setLoading(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('toast.error-type'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    let result;
    if (
      dataObj.type === 'VerifiableCredential' ||
      (dataObj.type as string[]).includes('VerifiableCredential')
    ) {
      result = await api.verifyData({
        credential: dataObj,
        verbose: true,
      });
    } else if (
      dataObj.type === 'VerifiablePresentation' ||
      (dataObj.type as string[]).includes('VerifiablePresentation')
    ) {
      result = await api.verifyData({
        presentation: dataObj,
        verbose: true,
      });
    } else {
      console.error('Wrong Data Type');
      setLoading(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('toast.error-type'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    useToastStore.setState({
      open: false,
    });

    if (isError(result)) {
      setData(result.error);
      setValid({ checked: true, valid: false });
      console.error(result);
      setLoading(false);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('toast.error-verify'),
          type: 'error',
          loading: false,
        });
      }, 200);
      return;
    }

    console.log(result.data);
    if ((result.data as IVerifyResult).verified) {
      setValid({ checked: true, valid: true });
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex w-full justify-between">
        <Link href="/app" className="flex items-center">
          <button className="animated-transition dark:text-navy-blue-50 dark:hover:bg-navy-blue-700 rounded-full text-gray-800 hover:bg-pink-100 hover:text-pink-700">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </Link>
        <div className="text-h3 dark:text-navy-blue-50 font-semibold text-gray-800">
          {t('title')}
        </div>
      </div>
      <div className="mt-5">
        <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 rounded-2xl border border-gray-200 bg-gray-100 pr-2 pt-1">
          <textarea
            className={clsx(
              'group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-800 dark:bg-navy-blue-300',
              'scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono',
              'min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none'
            )}
            value={data}
            placeholder="Paste your Verifiable Credential or Verifiable Presentation here!"
            onChange={(e) => {
              setData(e.target.value);
              setValid({ checked: false, valid: false });
            }}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-2">
        {valid.checked && valid.valid && (
          <CheckCircleIcon className="h-[31px] w-[31px] text-green-500 md:h-[38px] md:w-[38px]" />
        )}
        {valid.checked && !valid.valid && (
          <XCircleIcon className="h-[31px] w-[31px] text-red-500 md:h-[38px] md:w-[38px]" />
        )}
        <Button
          variant="primary"
          size="sm"
          loading={loading}
          onClick={() => verifyData()}
        >
          {t('verify')}
        </Button>
      </div>
    </div>
  );
};

export default VerifyDataDisplay;
