/* eslint-disable import/extensions */
import React from 'react';

import members from '../../constants/Members';
import styles from './styles.module.css';
import TeamCard from './TeamCard';

export default function Wrapper() {
  return (
    <div>
      <div className={styles.wrapper}>
        {members.map((member, i) => (
          <TeamCard key={i} member={member} />
        ))}
      </div>
    </div>
  );
}
