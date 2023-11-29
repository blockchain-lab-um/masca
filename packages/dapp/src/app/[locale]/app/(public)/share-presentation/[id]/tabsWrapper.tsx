'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/react';

interface TabWrapperProps {
  view: 'normal' | 'json';
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

  return (
    <Tabs
      defaultSelectedKey={view}
      onSelectionChange={(key) => {
        const params = new URLSearchParams(window.location.search);

        params.set('view', key.toString());
        if (key === 'json') {
          params.delete('page');
        } else {
          params.set('page', '1');
        }

        router.replace(`${pathname}?${params.toString()}`);
      }}
    >
      <Tab key="normal" title="Normal">
        {FormatedView}
      </Tab>
      <Tab key="json" title="Json">
        {JsonView}
      </Tab>
    </Tabs>
  );
};
