import React from 'react';
import { Button } from '@nextui-org/react';

interface RequirementProps {
  id: number;
  title: string;
  action: string;
  completed: boolean;
  issuer: string;
  types: string[];
  verify: () => Promise<boolean>;
}

export const Requirement = (props: RequirementProps) => {
  const { title, action, completed, issuer, types, verify } = props;

  return (
    <div className="flex justify-between w-full">
      {title}:
      {completed ? (
        <span>Completed</span>
      ) : (
        <Button onClick={verify}>Verify</Button>
      )}
    </div>
  );
};
