import type { Metadata } from 'next';

import ProjectIcon, { type ProjectIconProps } from '@/components/ProjectIcon';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description:
    'Ecosystem page where you can find all our partners and projects that use Masca.',
};

const partnersLight: ProjectIconProps[] = [
  {
    icon: '/images/MetaMask_Logo_White.svg',
    href: 'https://metamask.io',
    alt: 'MetaMask',
  },
  {
    icon: '/images/Polygon_ID_logo_light.svg',
    href: 'https://polygon.technology/polygon-id',
    alt: 'PolygonID',
  },
  {
    icon: '/images/ceramic_text_light.svg',
    href: 'https://ceramic.network/',
    alt: 'Ceramic',
  },
  {
    icon: '/images/veramo_light.svg',
    href: 'https://veramo.io/',
    alt: 'Veramo',
  },
  {
    icon: '/images/monokee_logo.png',
    href: 'https://monokee.com/en/homepage/',
    alt: 'monokee',
  },
];
const projectsLight: ProjectIconProps[] = [
  {
    icon: '/images/reputex_light.svg',
    href: 'https://reputex.io/',
    alt: 'MetaMask',
  },
];

const partnersDark: ProjectIconProps[] = [
  {
    icon: '/images/MetaMask_Logo.svg',
    href: 'https://metamask.io',
    alt: 'MetaMask',
  },
  {
    icon: '/images/Polygon_ID_logo_dark.svg',
    href: 'https://polygon.technology/polygon-id',
    alt: 'PolygonID',
  },
  {
    icon: '/images/ceramic_text.png',
    href: 'https://ceramic.network/',
    alt: 'Ceramic',
  },
  {
    icon: '/images/veramo2.png',
    href: 'https://veramo.io/',
    alt: 'Veramo',
  },
  {
    icon: '/images/monokee_logo.png',
    href: 'https://monokee.com/en/homepage/',
    alt: 'monokee',
  },
];
const projectsDark: ProjectIconProps[] = [
  {
    icon: '/images/reputex.png',
    href: 'https://reputex.io/',
    alt: 'MetaMask',
  },
];

export default function Page() {
  return (
    <div className="flex flex-col">
      <div>
        <h1 className="font-ubuntu dark:text-orange-accent-dark mb-4 text-center text-2xl font-medium text-pink-500">
          Applications
        </h1>
        <div className="flex w-full justify-center">
          <hr className="dark:border-orange-accent-dark w-full border-pink-500" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-2 dark:hidden">
          {projectsDark.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
        <div className="hidden flex-wrap justify-center gap-x-12 gap-y-2 dark:flex">
          {projectsLight.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
        <h1 className="font-ubuntu dark:text-orange-accent-dark mb-4 mt-12 text-center text-2xl font-medium text-pink-500">
          Partners
        </h1>
        <div className="flex w-full justify-center">
          <hr className="dark:border-orange-accent-dark w-full border-pink-500" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-2 dark:hidden">
          {partnersDark.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
        <div className="hidden flex-wrap justify-center gap-x-12 gap-y-2 dark:flex">
          {partnersLight.map((partner) => (
            <ProjectIcon key={partner.href} {...partner} />
          ))}
        </div>
      </div>
    </div>
  );
}
