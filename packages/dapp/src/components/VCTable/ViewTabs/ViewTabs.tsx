import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { useTableStore } from 'src/utils/store';

export const ViewTabs = () => {
  const cardView = useTableStore((state) => state.cardView);
  const setCardView = useTableStore((state) => state.setCardView);

  return (
    <Switch
      checked={cardView}
      onChange={setCardView}
      className="bg-white text-lg rounded-full border border-gray-200 shadow-md py-2"
    >
      <span
        className={`${
          !cardView ? 'bg-orange-500 text-white' : ''
        } text-orange-500 animated-transition py-2 px-4 rounded-full`}
      >
        Table
      </span>
      <span
        className={`${
          cardView ? 'bg-orange-500 text-white' : ''
        } text-orange-500 animated-transition py-2 px-4 rounded-full`}
      >
        Card
      </span>
    </Switch>
  );
};
