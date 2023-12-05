import { Metadata } from 'next';

import ProjectIcon, { type ProjectIconProps } from '@/components/ProjectIcon';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description:
    'Ecosystem page where you can find all our partners and projects that use Masca.',
};

// const integrations: ProjectIconProps[] = [];

const partnersLight: ProjectIconProps[] = [
  {
    icon: '/images/MetaMask_Logo_White.svg',
    href: 'https://metamask.io',
    alt: 'MetaMask',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/Polygon_ID_logo_light.svg',
    href: 'https://polygon.technology/polygon-id',
    alt: 'PolygonID',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/ceramic_text_light.svg',
    href: 'https://ceramic.network/',
    alt: 'Ceramic',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/veramo_light.svg',
    href: 'https://veramo.io/',
    alt: 'Veramo',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/monokee_logo.png',
    href: 'https://monokee.com/en/homepage/',
    alt: 'monokee',
    width: 192,
    height: 96,
  },
];
const projectsLight: ProjectIconProps[] = [
  {
    icon: '/images/reputex_light.svg',
    href: 'https://reputex.io/',
    alt: 'MetaMask',
    width: 156,
    height: 96,
    rounded: true,
  },
];

const partnersDark: ProjectIconProps[] = [
  {
    icon: '/images/MetaMask_Logo.svg',
    href: 'https://metamask.io',
    alt: 'MetaMask',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/Polygon_ID_logo_dark.svg',
    href: 'https://polygon.technology/polygon-id',
    alt: 'PolygonID',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/ceramic_text.png',
    href: 'https://ceramic.network/',
    alt: 'Ceramic',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/veramo2.png',
    href: 'https://veramo.io/',
    alt: 'Veramo',
    width: 192,
    height: 96,
  },
  {
    icon: '/images/monokee_logo.png',
    href: 'https://monokee.com/en/homepage/',
    alt: 'monokee',
    width: 192,
    height: 96,
  },
];
const projectsDark: ProjectIconProps[] = [
  {
    icon: '/images/reputex.png',
    href: 'https://reputex.io/',
    alt: 'MetaMask',
    width: 192,
    height: 96,
    rounded: true,
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
          Applications
        </h1>
        <div className="flex flex-wrap justify-center gap-x-12 dark:hidden">
          {projectsDark.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
        <div className="hidden flex-wrap justify-center gap-x-12 dark:flex">
          {projectsLight.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
        <h1 className="font-ubuntu dark:text-navy-blue-50 mb-4 mt-12 text-center text-2xl font-medium text-gray-900">
          Partners
        </h1>
        <div className="flex flex-wrap justify-center gap-x-12 dark:hidden">
          {partnersDark.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
        <div className="hidden flex-wrap justify-center gap-x-12 dark:flex">
          {partnersLight.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
      </div>
    </div>
  );
}
