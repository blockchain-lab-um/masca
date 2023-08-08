import React from 'react';

import { Member } from '../../constants/Members';
import styles from './styles.module.css';

interface TeamCardProps {
  member: Member;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className={styles.teamCard}>
      <div className={styles.cardBody}>
        <div className={styles.cardImageHolder}>
          <img className={styles.cardImage} src={member.image} alt="team" />
        </div>
        <div className={styles.cardText}>
          <h2 className={styles.cardTitle}>{member.name}</h2>
          <h2 className={styles.cardSubtitle}>{member.title}</h2>
        </div>
        <hr className={styles.cardHr} />
      </div>
      <div className={styles.cardIcons}>
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noreferrer">
            <i className="fa-brands fa-linkedin" />
          </a>
        )}
        {member.twitter && (
          <a href={member.twitter} target="_blank" rel="noreferrer">
            <i className="fa-brands fa-square-twitter" />
          </a>
        )}
        {member.github && (
          <a href={member.github} target="_blank" rel="noreferrer">
            <i className="fa-brands fa-square-github" />
          </a>
        )}
      </div>
    </div>
  );
}
