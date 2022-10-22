import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/ssi-snap-docs/__docusaurus/debug',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug', 'dc1'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/__docusaurus/debug/config',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug/config', 'bdc'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/__docusaurus/debug/content',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug/content', 'e84'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/__docusaurus/debug/globalData',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug/globalData', '13f'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/__docusaurus/debug/metadata',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug/metadata', '1bf'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/__docusaurus/debug/registry',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug/registry', '75f'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/__docusaurus/debug/routes',
    component: ComponentCreator('/ssi-snap-docs/__docusaurus/debug/routes', '03a'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/markdown-page',
    component: ComponentCreator('/ssi-snap-docs/markdown-page', '6bb'),
    exact: true
  },
  {
    path: '/ssi-snap-docs/docs',
    component: ComponentCreator('/ssi-snap-docs/docs', '5cc'),
    routes: [
      {
        path: '/ssi-snap-docs/docs/category/libraries--plugins',
        component: ComponentCreator('/ssi-snap-docs/docs/category/libraries--plugins', '8e4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/category/self-sovereign-identity---basics',
        component: ComponentCreator('/ssi-snap-docs/docs/category/self-sovereign-identity---basics', 'f62'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/category/ssi-snap',
        component: ComponentCreator('/ssi-snap-docs/docs/category/ssi-snap', 'e5c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/category/team',
        component: ComponentCreator('/ssi-snap-docs/docs/category/team', '9e7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/category/use-ssi-snap',
        component: ComponentCreator('/ssi-snap-docs/docs/category/use-ssi-snap', '040'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/config',
        component: ComponentCreator('/ssi-snap-docs/docs/config', '79e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/faqs',
        component: ComponentCreator('/ssi-snap-docs/docs/faqs', 'e23'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/get_started',
        component: ComponentCreator('/ssi-snap-docs/docs/get_started', 'efe'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/glossary',
        component: ComponentCreator('/ssi-snap-docs/docs/glossary', '9ad'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/intro',
        component: ComponentCreator('/ssi-snap-docs/docs/intro', '8fc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/plugins/ssi-snap-connector',
        component: ComponentCreator('/ssi-snap-docs/docs/plugins/ssi-snap-connector', '906'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/plugins/vc-manager',
        component: ComponentCreator('/ssi-snap-docs/docs/plugins/vc-manager', 'a79'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/roadmap',
        component: ComponentCreator('/ssi-snap-docs/docs/roadmap', '842'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi', '9a4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi-snap/architecture',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi-snap/architecture', '997'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi-snap/design',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi-snap/design', '247'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi-snap/intro',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi-snap/intro', '4ec'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi-snap/storage',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi-snap/storage', '591'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi/did',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi/did', '6cf'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi/trust-model',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi/trust-model', '6b6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi/vc',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi/vc', '78e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/ssi/vp',
        component: ComponentCreator('/ssi-snap-docs/docs/ssi/vp', 'f53'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/team',
        component: ComponentCreator('/ssi-snap-docs/docs/team', '4ab'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/team/blockchain_lab',
        component: ComponentCreator('/ssi-snap-docs/docs/team/blockchain_lab', '9c9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/tutorial/demo',
        component: ComponentCreator('/ssi-snap-docs/docs/tutorial/demo', '90b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/tutorial/implementation',
        component: ComponentCreator('/ssi-snap-docs/docs/tutorial/implementation', 'fd5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/ssi-snap-docs/docs/tutorial/rpc-methods',
        component: ComponentCreator('/ssi-snap-docs/docs/tutorial/rpc-methods', '757'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/ssi-snap-docs/',
    component: ComponentCreator('/ssi-snap-docs/', 'b11'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
