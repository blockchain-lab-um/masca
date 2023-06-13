'use client';

import React from 'react';
import { Switch } from '@headlessui/react';
import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { useTableStore } from '@/stores';

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
      className="dark:bg-navy-blue-700 relative flex md:w-28 w-24 md:h-[43px] h-[37px] flex-shrink-0 items-center justify-between rounded-full bg-white shadow-md outline-none focus-visible:outline-none"
    >
      <div
        className={` dark:bg-orange-accent-dark absolute z-10 h-full md:w-16 w-14 rounded-full bg-pink-100 transition-transform ease-in-out ${
          cardView ? 'translate-x-0' : 'translate-x-10 md:translate-x-12'
        }`}
      ></div>
      <Squares2X2Icon
        className={`animated-transition z-20 ${
          cardView
            ? ' dark:text-navy-blue-800 text-gray-800'
            : ' dark:text-navy-blue-300 dark:hover:text-navy-blue-200 text-gray-500 hover:text-gray-700'
        }  ml-4 md:h-7 md:w-7 h-6 w-6 rounded-full`}
      />
      <Bars3Icon
        className={`animated-transition z-20  ${
          !cardView
            ? ' dark:text-navy-blue-800 text-gray-800'
            : ' dark:text-navy-blue-400 dark:hover:text-navy-blue-300 text-gray-500 hover:text-gray-700'
        }  mr-3.5 md:h-8 md:w-8 h-6 w-6 rounded-full`}
      />
    </Switch>
  );
};

export default ViewTabs;
