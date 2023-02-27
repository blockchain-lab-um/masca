import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { useTableStore } from 'src/utils/store';
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/solid';

export const ViewTabs = () => {
  const cardView = useTableStore((state) => state.cardView);
  const setCardView = useTableStore((state) => state.setCardView);

  return (
    <Switch
      checked={cardView}
      onChange={setCardView}
      className="bg-white rounded-full border border-gray-200 shadow-md h-9 w-20 flex items-center justify-between px-2 py-0.5"
    >
      <Squares2X2Icon
        className={`${
          cardView
            ? ' w-8 h-8 text-orange-500 animated-transition duration-75'
            : 'text-orange-200 hover:bg-orange-50 hover:text-orange-300 w-7 h-7'
        } text-orange-500 animated-transition rounded-full`}
      />
      <Bars3Icon
        className={`${
          !cardView
            ? 'w-8 h-8  text-orange-500 animated-transition duration-75'
            : 'text-orange-200 hover:bg-orange-50 hover:text-orange-300 w-7 h-7'
        } text-orange-500 animated-transition rounded-full`}
      />
    </Switch>
  );
};
