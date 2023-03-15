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
      className="relative flex w-28 flex-shrink-0 items-center justify-between rounded-full bg-white py-0.5 shadow-md"
    >
      <div
        className={` absolute z-10 h-full w-16 rounded-full bg-pink-100 transition-transform ease-in-out ${
          cardView ? 'translate-x-0' : 'translate-x-12'
        }`}
      ></div>
      <Squares2X2Icon
        className={`z-20  ${
          cardView ? ' text-pink-600' : ' text-gray-700 hover:text-gray-500'
        }  ml-3.5 h-8 w-8 rounded-full`}
      />
      <Bars3Icon
        className={`z-20  ${
          !cardView ? ' text-pink-600' : ' text-gray-700 hover:text-gray-500'
        }  mr-3.5 h-8 w-8 rounded-full`}
      />
    </Switch>
  );
};

export default ViewTabs;
