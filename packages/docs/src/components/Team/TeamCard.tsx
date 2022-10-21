import React from 'react';
import { Member } from '../../constants/Members';
import styles from './styles.module.css';

type TeamCardProps = {
  member: Member;
};

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className={styles.teamCard}>
      <div className={styles.cardBody}>
        <div className={styles.cardImageHolder}>
          <img className={styles.cardImage} src={member.image} alt="team" />
        </div>
        <h2 className={styles.cardTitle}>{member.name}</h2>
        <h2 className={styles.cardSubtitle}>{member.title}</h2>
        <hr className={styles.cardHr} />
        <p className={styles.cardDescription}>{member.description}</p>
      </div>
      <div className={styles.cardIcons}>
        <a href={member.linkedin} target="_blank" rel="noreferrer">
          <i className="fa-brands fa-linkedin" />
        </a>
        <a href={member.twitter} target="_blank" rel="noreferrer">
          <i className="fa-brands fa-square-twitter" />
        </a>
      </div>
    </div>
  );
}
