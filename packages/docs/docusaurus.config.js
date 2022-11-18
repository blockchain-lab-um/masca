/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SSI Snap',
  tagline: 'Self-Sovereign Identity is cool',
  url: 'https://blockchain-lab-um.github.io/',
  baseUrl: '/ssi-snap-docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/ssi_snap_logo_2.svg',
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'blockchain-lab-um', // Usually your GitHub org/user name.
  projectName: 'ssi-snap-docs', // Usually your repo name.
  customFields: {},
  plugins: [
    [
      'docusaurus2-dotenv',
      {
        systemvars: true,
      },
    ],
  ],
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  scripts: ['https://kit.fontawesome.com/77dffd2c3b.js'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/blockchain-lab-um/ssi-snap-docs/edit/master/',
        },
        blog: {
          blogSidebarTitle: 'Titles',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/blockchain-lab-um/ssi-snap-docs/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'SSI Snap Docs',
      logo: {
        alt: 'SSI Snap Logo',
        src: 'img/ssi_snap_logo_2.svg',
      },
      items: [
        { to: '/docs/get_started', label: 'Quickstart', position: 'left' },
        { to: '/docs/introduction', label: 'Docs', position: 'left' },
        { to: '/docs/config', label: 'Configure SSI Snap', position: 'left' },
        {
          to: 'https://medium.com/@blockchainlabum',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://discord.com/invite/M5xgNz7TTF',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://github.com/blockchain-lab-um/ssi-snap',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          label: 'Documentation',
          to: '/docs/introduction',
        },
        {
          label: 'Website',
          href: 'https://blockchain-lab.um.si/?lang=en',
        },
        {
          label: 'Twitter',
          href: 'https://twitter.com/blockchainlabum',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/blockchain-lab-um',
        },
        {
          label: 'Discord',
          href: 'https://discord.com/invite/M5xgNz7TTF',
        },
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/company/blockchain-lab-um',
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/@blockchainlabum',
        },
        {
          label: 'Email',
          href: 'mailto:blockchain-lab@um.si',
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Blockchain Lab:UM. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
