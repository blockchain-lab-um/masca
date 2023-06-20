import { Metadata } from 'next';

import ProjectIcon, { type ProjectIconProps } from '@/components/ProjectIcon';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description:
    'Ecosystem page where you can find all our partners and projects that use Masca.',
};

// const integrations: ProjectIconProps[] = [];

const partners: ProjectIconProps[] = [
  {
    icon: '/images/monokee_logo.png',
    href: 'https://monokee.com/en/homepage/',
    alt: 'monokee',
    width: 192,
    height: 96,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center pt-20">
      {/* <div>
        <h1 className="font-ubuntu dark:text-navy-blue-50 mb-4 mb-8 text-center text-2xl font-medium text-gray-900">
          Integrations
        </h1>
        <div className="justify flex flex-wrap justify-center gap-x-12">
          {integrations.map((integration) => (
            <ProjectIcon key={integration.href} {...integration} />
          ))}
        </div>
      </div> */}
      <div>
        <h1 className="font-ubuntu dark:text-navy-blue-50 mb-4 text-center text-2xl font-medium text-gray-900">
          Partners
        </h1>
        <div className="flex flex-wrap justify-center gap-x-12">
          {partners.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
      </div>
    </div>
  );
}
