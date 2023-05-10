import React from 'react';
import Beach from '@site/static/img/beach.svg';
import Rocket from '@site/static/img/rocket.svg';
import Specialist from '@site/static/img/specialist.svg';

import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Self-Sovereignty',
    svg: (
      <Specialist role="presentation" className={styles.featureSpecialist} />
    ),
    description:
      "Decentralized identity (or Self-sovereign identity - SSI) turns the world of digital identity upside down - but for the better! web3 is all about self-ownership; it's time to take that leap for personal data and attestations.",
  },
  {
    title: 'Easy-to-Use',
    svg: <Beach role="presentation" className={styles.featureBeach} />,
    description:
      "Masca adds support for Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) directly to MetaMask, without requiring an additional snap or extension. And that's not even the best part: identity is fully configurable by users - they should decide where their identity data should be stored!",
  },
  {
    title: '(Really) Fast Integration',
    svg: <Rocket role="presentation" className={styles.featureRocket} />,
    description:
      "Not entirely sure how to handle user data and what methods/networks you should support? You can unlock the power of decentralized identity with just some additional RPC methods without going into the details of where the user's data is stored.",
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
