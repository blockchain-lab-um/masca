import { Pagination } from '@nextui-org/react';

import { TextSkeleton } from '../Skeletons/TextSkeleton';

export default function SharedPresentationsSkeleton() {
  return (
    <div className="flex w-full flex-1 items-start justify-center">
      <div className="max-w-full flex-1 md:max-w-3xl">
        <div className="dark:bg-navy-blue-800 h-full w-full rounded-3xl bg-white shadow-lg">
          <div className="dark:from-navy-blue-700 dark:to-navy-blue-700 flex max-w-full flex-col-reverse items-center space-x-4 rounded-t-2xl bg-gradient-to-br from-pink-100 to-orange-100 px-10 pb-2 pt-6 sm:flex-row">
            <div className="flex w-full">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col gap-1">
                  <TextSkeleton className="h-[1em] w-[6em]" />
                  <h1 className="font-ubuntu dark:text-orange-accent-dark text-left text-lg font-medium text-pink-500 sm:text-xl md:text-2xl lg:truncate">
                    <div className="mt-2 flex items-center">
                      <TextSkeleton className="h-[1em] w-[14em]" />
                    </div>
                  </h1>
                </div>
                <div className="flex flex-col gap-1">
                  <TextSkeleton className="h-[1em] w-[8em]" />
                  <TextSkeleton className="h-[1em] w-[5em]" />
                </div>
                <div className="flex flex-col">
                  <TextSkeleton className="h-[1em] w-[8em]" />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-1 justify-end space-x-1">
              <div className="flex flex-col items-end gap-1">
                <TextSkeleton className="h-[1.8em] w-[6em]" />
                <TextSkeleton className="h-[1em] w-[4em]" />
              </div>
            </div>
          </div>
          <div className="px-4 pb-6">
            <div className="ml-[14px] flex justify-start px-2">
              <Pagination
                loop
                color="success"
                total={1}
                classNames={{
                  wrapper:
                    'space-x-2 pl-4 pr-6 pb-2 pt-1 rounded-none rounded-b-2xl bg-gradient-to-tr from-pink-100 to-orange-100 dark:from-navy-blue-700 dark:to-navy-blue-700',
                  item: 'flex-nowrap w-5 h-5 text-black dark:text-navy-blue-200 bg-inherit shadow-none active:bg-inherit active:text-black dark:active:text-navy-blue-200 [&[data-hover=true]:not([data-active=true])]:bg-inherit',
                  cursor:
                    'w-5 h-5 rounded-full dark:bg-orange-accent-dark bg-pink-500 text-white dark:text-navy-blue-800',
                }}
              />
            </div>
            <div className="flex flex-col space-y-8">
              <div className="items-cetner flex flex-col-reverse px-6 pt-6 sm:flex-row">
                <div className="flex w-full flex-col gap-1 sm:w-11/12">
                  <TextSkeleton className="h-[1em] w-[10em] p-1" />
                  <TextSkeleton className="h-[1em] w-[16em] p-1" />
                </div>
                <div className="flex w-full flex-1 justify-end space-x-1">
                  <div className="flex flex-col items-end gap-1">
                    <TextSkeleton className="h-[1.8em] w-[6em]" />
                    <TextSkeleton className="h-[1em] w-[4em]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-8 px-6 md:flex-row md:space-x-16 md:space-y-0">
                <div className="flex w-full flex-col items-start space-y-2 md:max-w-[50%]">
                  <TextSkeleton className="h-[1.3em] w-[5em]" />
                  <div className="flex w-full flex-col items-start space-y-0.5 overflow-clip">
                    <TextSkeleton className="h-[1em] w-[3em]" />
                    <div className="text-md dark:text-navy-blue-300 w-full truncate font-normal text-gray-700">
                      <TextSkeleton className="h-[1em] w-[7em]" />
                    </div>
                    <h2 className="dark:text-navy-blue-200 pr-2 font-bold capitalize text-gray-800">
                      <TextSkeleton className="h-[1em] w-[3em]" />
                    </h2>
                    <div className="text-md dark:text-navy-blue-300 w-full truncate font-normal text-gray-700">
                      <TextSkeleton className="h-[1em] w-[12em]" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-col space-y-8">
                    <div className="flex flex-col items-start justify-center space-y-2 ">
                      <TextSkeleton className="h-[1.3em] w-[5em]" />
                      <div className="flex flex-col space-y-0.5">
                        <div className="flex flex-col gap-1">
                          <TextSkeleton className="h-[1em] w-[3em]" />
                          <TextSkeleton className="h-[1em] w-[12em]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <TextSkeleton className="h-[1.3em] w-[5em]" />
                      <div className="flex flex-col items-start gap-1 space-y-0.5">
                        <TextSkeleton className="h-[1em] w-[10em]" />
                        <TextSkeleton className="h-[1em] w-[10em]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-md dark:text-navy-blue-200 cursor-pointer px-6 font-medium text-gray-700">
                <TextSkeleton className="h-[1em] w-[3em]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
