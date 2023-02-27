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
      className="bg-white text-lg rounded-full border border-gray-200 shadow-md py-2 px-1"
    >
      <span
        className={`${
          !cardView
            ? 'bg-orange-100 w-full rounded-full py-2 font-semibold px-4 text-orange-500 animated-transition'
            : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
        } text-orange-500 animated-transition py-1 px-3 rounded-full`}
      >
        Table
      </span>
      <span
        className={`${
          cardView
            ? 'bg-orange-100 w-full rounded-full py-2 font-semibold px-4 text-orange-500 animated-transition'
            : 'text-orange-900 hover:bg-orange-100 hover:text-orange-700'
        } text-orange-500 animated-transition py-1 px-3 rounded-full`}
      >
        Card
      </span>
    </Switch>
  );
};
