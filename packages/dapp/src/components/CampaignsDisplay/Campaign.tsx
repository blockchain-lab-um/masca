import React, { ReactNode } from 'react';

interface CampaignProps {
  id: number;
  title: string;
  description: string;
  claimed: number;
  total: number;
  image_url: string;
  requirements: ReactNode[];
}

export const Campaign = (props: CampaignProps) => {
  const { title, description, claimed, total, image_url, requirements } = props;

  return (
    <div>
      {title}
      {description}
      Requirements
      <div>{requirements.map((requirement: ReactNode) => requirement)}</div>
    </div>
  );
};
