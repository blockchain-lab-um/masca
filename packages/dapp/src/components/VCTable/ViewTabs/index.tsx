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
      className="bg-white rounded-full border border-gray-200 shadow-md h-9 w-20 flex items-center justify-between px-2 py-0.5"
    >
      <Squares2X2Icon
        className={`${
          cardView
            ? ' w-8 h-8 text-orange-500 animated-transition duration-75'
            : 'text-orange-200 hover:bg-orange-50 hover:text-orange-300 w-7 h-7'
        }  animated-transition rounded-full`}
      />
      <Bars3Icon
        className={`${
          !cardView
            ? 'w-8 h-8  text-orange-500 animated-transition duration-75'
            : 'text-orange-200 hover:bg-orange-50 hover:text-orange-300 w-7 h-7'
        } animated-transition rounded-full`}
      />
    </Switch>
  );
};

export default ViewTabs;
