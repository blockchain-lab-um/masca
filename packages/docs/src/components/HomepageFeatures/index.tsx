import React from 'react';
import DocusaurusReact from '@site/static/img/undraw_docusaurus_react.svg';
import DocusaurusMountain from '@site/static/img/undraw_docusaurus_mountain.svg';
import DocusaurusTree from '@site/static/img/undraw_docusaurus_tree.svg';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Self-Sovereign Identity',
    svg: <DocusaurusReact role="presentation" className={styles.featureSvg} />,
    description:
      'Take your online identity to the next level and start using Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) in the most popular crypto wallet.',
  },
  {
    title: 'Easy-to-Use',
    svg: (
      <DocusaurusMountain role="presentation" className={styles.featureSvg} />
    ),
    description:
      'SSI Snap expands MetaMask capabilities and does not require additional application or extension for Self-Sovereign Identity.',
  },
  {
    title: 'Fast Integration',
    svg: <DocusaurusTree role="presentation" className={styles.featureSvg} />,
    description:
      'Easily integrate SSI Snap into any decentralized application (dApp) that currently supports MetaMask.',
  },
];

type FeatureProps = {
  title: string;
  svg: JSX.Element;
  description: string;
};

function Feature({ title, svg, description }: FeatureProps) {
  return (
    <div className="col col--4">
      <div className="text--center">{svg}</div>
      <div className="text--center padding-horiz--md">
        <h3 className={styles.featureTitle}>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((feature, idx) => (
            <Feature key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
