'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { isError } from '@blockchain-lab-um/masca-connector';
import { useTranslations } from 'next-intl';

import { stringifyCredentialSubject } from '@/utils/format';
import { useMascaStore, useTableStore, useToastStore } from '@/stores';
import Button from '../Button';
import CredentialTable from './CredentialTable';

const DashboardDisplay = () => {
  const t = useTranslations('Dashboard');
  const [loading, setLoading] = useState(false);
  const { api, vcs, changeVcs, changeLastFetch } = useMascaStore((state) => ({
    api: state.mascaApi,
    vcs: state.vcs,
    changeVcs: state.changeVcs,
    changeLastFetch: state.changeLastFetch,
  }));

  const { cardView } = useTableStore((state) => ({
    cardView: state.cardView,
  }));

  // Functions
  const loadVCs = async () => {
    if (!api) return;
    const loadedVCs = await api.queryCredentials();

    if (isError(loadedVCs)) {
      console.log(loadedVCs.error);
      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('query-error'),
          type: 'error',
          loading: false,
          link: null,
        });
      }, 200);
      return;
    }

    changeLastFetch(Date.now());

    if (loadedVCs.data) {
      changeVcs(loadedVCs.data.map((vc) => stringifyCredentialSubject(vc)));
      if (loadedVCs.data.length === 0) {
        setTimeout(() => {
          useToastStore.setState({
            open: true,
            title: t('query-no-credentials'),
            type: 'info',
            loading: false,
            link: null,
          });
        }, 200);
        return;
      }

      setTimeout(() => {
        useToastStore.setState({
          open: true,
          title: t('query-success'),
          type: 'success',
          loading: false,
          link: null,
        });
      }, 200);
    }
  };

  const handleLoadVcs = async () => {
    setLoading(true);
    await loadVCs();
    setLoading(false);
  };

  if (vcs.length === 0)
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleLoadVcs}
          loading={loading}
        >
          {t('no-credentials.load')}
        </Button>
        <span className="py-4 text-lg font-semibold">
          {t('no-credentials.or')}
        </span>
        <Link href="/app/create-credential">
          <Button variant="secondary" size="sm" onClick={() => {}}>
            {t('no-credentials.get')}
          </Button>
        </Link>
      </div>
    );

  return <CredentialTable />;
};

export default DashboardDisplay;
