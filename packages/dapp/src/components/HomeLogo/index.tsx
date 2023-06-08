import Image from 'next/image';

const HomeLogo = () => {
  return (
    <button className="outline-none focus-visible:outline-none">
      <div className="flex">
        <div className="relative h-[24px] w-[28px] rounded-full object-center sm:h-[36px] sm:w-[40px] lg:h-[46px] lg:w-[50px] xl:h-[48px] xl:w-[54px]">
          <Image
            className="dark:hidden"
            src={'/images/masca_black.png'}
            alt="Masca Logo"
            fill={true}
          />
          <Image
            className="hidden dark:block"
            src={'/images/masca_white.png'}
            alt="Masca Logo"
            fill={true}
          />
        </div>
        <h1 className="font-ubuntu text-h4 sm:text-h2 lg:text-h1 animated-transition dark:text-navy-blue-300 ml-4 text-gray-900 hover:text-pink-400 dark:hover:text-orange-200">
          Masca
        </h1>
      </div>
    </button>
  );
};

export default HomeLogo;
