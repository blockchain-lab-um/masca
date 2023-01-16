import React from 'react';
// eslint-disable-next-line import/extensions
import TeamCard from './TeamCard';
import members from '../../constants/Members';
import styles from './styles.module.css';

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
