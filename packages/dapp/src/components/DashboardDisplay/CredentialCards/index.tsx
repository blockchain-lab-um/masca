import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { Button, Pagination } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useTableStore } from '@/stores';
import { LastFetched } from '../LastFetched';
import CredentialCard from './CredentialCard';

const CARDS_PER_PAGE = 6;

interface CredentialCardsProps {
  vcs: QueryCredentialsRequestResult[];
}

export const CredentialCards = ({ vcs }: CredentialCardsProps) => {
  const t = useTranslations('CredentialCards');
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { selectedCredentials, setSelectedCredentials } = useTableStore(
    (state) => ({
      selectedCredentials: state.selectedCredentials,
      setSelectedCredentials: state.setSelectedCredentials,
    })
  );

  const pages = Math.ceil(vcs.length / CARDS_PER_PAGE);

  // Get items for current page
  const items: QueryCredentialsRequestResult[] = useMemo(() => {
    const start = (page - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;

    const newItems = vcs.slice(start, end);

    return newItems;
  }, [page, vcs]);

  return (
    <div className="flex h-full w-full flex-col justify-between pb-4">
      <div>
        <div className="dark:border-navy-blue-600 flex items-center justify-between p-9">
          <div className="text-h2 font-ubuntu dark:text-navy-blue-50 font-medium text-gray-800">
            {t('credentials')}
          </div>
          <div className="text-right">
            <div className="text-h4 dark:text-navy-blue-50 text-gray-800">
              {vcs.length} {t('found')}
            </div>
            <LastFetched />
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          {items.map((vc) => (
            <div
              key={vc.metadata.id}
              onClick={() => {
                // Add VC to selectedCards if not already in, else remove it
                if (!selectedCredentials.includes(vc)) {
                  setSelectedCredentials([...selectedCredentials, vc]);
                } else {
                  setSelectedCredentials(
                    selectedCredentials.filter((item) => item !== vc)
                  );
                }
              }}
            >
              <CredentialCard
                vc={vc}
                selected={selectedCredentials.includes(vc)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between px-9">
        <div className="w-1/3" />
        <div className="flex h-[40px] w-1/3 items-center justify-center">
          <Pagination
            isCompact
            showControls
            showShadow={false}
            color="primary"
            variant="flat"
            page={page}
            total={pages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
        <div className="flex w-1/3 items-center justify-end">
          {selectedCredentials.length > 0 && (
            <Button
              color="primary"
              size="md"
              className="rounded-full"
              onClick={() => {
                router.push('/app/create-verifiable-presentation');
              }}
            >
              {t('create-verifiable-presentation')} (
              {selectedCredentials.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
