import React from 'react';
import { Switch } from '@headlessui/react';
import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { shallow } from 'zustand/shallow';

import { useTableStore } from '@/utils/stores';

const ViewTabs = () => {
  const { cardView, setCardView } = useTableStore(
    (state) => ({
      cardView: state.cardView,
      setCardView: state.setCardView,
    }),
    shallow
  );

  return (
    <Switch
      checked={cardView}
      onChange={setCardView}
      className="flex h-9 w-20 items-center justify-between rounded-full border border-gray-200 bg-white px-2 py-0.5 shadow-md"
    >
      <Squares2X2Icon
        className={`${
          cardView
            ? ' animated-transition h-8 w-8 text-orange-500 duration-75'
            : 'h-7 w-7 text-orange-200 hover:bg-orange-50 hover:text-orange-300'
        }  animated-transition rounded-full`}
      />
      <Bars3Icon
        className={`${
          !cardView
            ? 'animated-transition h-8  w-8 text-orange-500 duration-75'
            : 'h-7 w-7 text-orange-200 hover:bg-orange-50 hover:text-orange-300'
        } animated-transition rounded-full`}
      />
    </Switch>
  );
};

export default ViewTabs;
