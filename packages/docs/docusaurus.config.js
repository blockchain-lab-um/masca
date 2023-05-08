/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Masca',
  tagline: 'Decentralized Identity is cool',
  url: 'https://www.docs.masca.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/masca_icon_b.png',
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'blockchain-lab-um', // Usually your GitHub org/user name.
  projectName: 'masca-docs', // Usually your repo name.
  customFields: {},
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
            'https://github.com/blockchain-lab-um/masca/edit/develop/packages/docs/',
        },
        blog: {
          blogSidebarTitle: 'Titles',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/blockchain-lab-um/masca/packages/docs/edit/develop/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Masca Docs',
      logo: {
        alt: 'Masca Logo',
        src: 'img/masca_icon_b.png',
      },
      items: [
        { to: '/docs/introduction', label: 'Docs', position: 'left' },
        { to: '/docs/getting-started', label: 'Quickstart', position: 'left' },
        {
          href: 'https://masca.io',
          label: 'App',
          position: 'left',
        },
        {
          href: 'https://medium.com/@blockchainlabum',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://discord.com/invite/M5xgNz7TTF',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://github.com/blockchain-lab-um/masca',
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
