import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import clsx from 'clsx';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.homeContainer}>
      <h4 className={styles.homeSlogan}>
        Unlock Decentralized Identity with MetaMask
      </h4>
      <h1 className={styles.homeTitle}>{siteConfig.title}</h1>
      <br />
      <div className={styles.buttons}>
        <Link
          className={clsx('button', styles.homeButton)}
          to="https://blockchain-lab-um.github.io/course-dapp/"
        >
          Live Demo
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout title="SSI Snap Docs" description="SSI Snap Documentation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
