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
      className="dark:bg-navy-blue-700 relative flex w-28 flex-shrink-0 items-center justify-between rounded-full bg-white py-0.5 shadow-md"
    >
      <div
        className={` dark:bg-orange-accent-dark absolute z-10 h-full w-16 rounded-full bg-pink-300 transition-transform ease-in-out ${
          cardView ? 'translate-x-0' : 'translate-x-12'
        }`}
      ></div>
      <Squares2X2Icon
        className={`animated-transition z-20 ${
          cardView
            ? ' dark:text-navy-blue-900 text-gray-900'
            : ' dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-700 hover:text-gray-500'
        }  ml-3.5 h-8 w-8 rounded-full`}
      />
      <Bars3Icon
        className={`animated-transition z-20  ${
          !cardView
            ? ' dark:text-navy-blue-900 text-gray-900'
            : ' dark:text-navy-blue-400 dark:hover:text-navy-blue-300 text-gray-700 hover:text-gray-500'
        }  mr-3.5 h-8 w-8 rounded-full`}
      />
    </Switch>
  );
};

export default ViewTabs;
