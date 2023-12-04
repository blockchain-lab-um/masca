'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface TabWrapperProps {
  view: 'Normal' | 'Json';
  FormatedView: React.ReactNode;
  JsonView: React.ReactNode;
}

export const TabWrapper = ({
  view,
  FormatedView,
  JsonView,
}: TabWrapperProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState<'Normal' | 'Json'>('Normal');

  return (
    <>
      {/* <Tabs
        onSelectionChange={(key) => {
          const params = new URLSearchParams(window.location.search);

          params.set('view', key.toString());
          if (key === 'json') {
            params.delete('page');
          } else {
            params.set('page', '1');
          }

          router.replace(`${pathname}?${params.toString()}`);
          setSelectedTab(key as 'Normal' | 'Json');
        }}
        radius="lg"
        size="lg"
        className="mb-4"
        classNames={{
          cursor: 'dark:bg-orange-accent-dark bg-pink-200',
          tabList: 'bg-white dark:bg-navy-blue-800',
          tabContent:
            'dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500 dark:group-data-[selected=true]:text-navy-blue-900 group-data-[selected=true]:text-gray-800',
        }}
      >
        <Tab key="Normal" title="Normal" />
        <Tab key="Json" title="Json" />
      </Tabs> */}
      <>
        {view === 'Normal' && FormatedView}
        {view === 'Json' && JsonView}
      </>
    </>
  );
};
