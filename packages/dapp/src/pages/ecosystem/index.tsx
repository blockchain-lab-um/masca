import React from 'react';

import Icon, { IconProps } from './Icon';

const integrations: IconProps[] = [];

const collaborations: IconProps[] = [
  {
    icon: '/images/monokee_logo.png',
    href: 'https://monokee.com/en/homepage/',
    alt: 'monokee',
    width: 192,
    height: 96,
  },
];

export default function Ecosystem() {
  return (
    <div className="grid place-items-center">
      <div className="p-4 text-lg">
        <div className="font-ubuntu dark:text-navy-blue-50 text-center text-2xl font-medium leading-6 text-gray-900">
          Integrations
        </div>
        <div className="my-12 flex justify-center gap-x-12">
          {integrations.map((integration) => (
            <Icon key={integration.href} {...integration} />
          ))}
        </div>
        <div className="font-ubuntu dark:text-navy-blue-50 pt-12 text-center text-2xl font-medium leading-6 text-gray-900">
          Collaborations
        </div>
        <div className="my-12 flex justify-center gap-x-12">
          {collaborations.map((collaboration) => (
            <Icon key={collaboration.href} {...collaboration} />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps(context: { locale: any }) {
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      messages: (await import(`../../locales/${context.locale}.json`)).default,
    },
  };
}
