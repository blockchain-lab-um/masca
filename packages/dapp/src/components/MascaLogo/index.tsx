import Image from 'next/image';

const MascaLogo = () => (
  <div className="relative h-[24px] w-[28px] sm:h-[36px] sm:w-[40px] lg:h-[46px] lg:w-[50px] xl:h-[48px] xl:w-[54px]">
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
      sizes="(max-width: 640px) 28px, (max-width: 768px) 36px, (max-width: 1024px) 46px, (max-width: 1280px) 48px, 54px"
    />
  </div>
);

export default MascaLogo;
