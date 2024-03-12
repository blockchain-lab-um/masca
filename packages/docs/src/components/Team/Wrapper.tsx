import React from 'react';

import members from '../../constants/Members';
import TeamCard from './TeamCard';
import styles from './styles.module.css';

export default function Wrapper() {
  return (
    <div>
      <div className={styles.wrapper}>
        {members.map((member, i) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
