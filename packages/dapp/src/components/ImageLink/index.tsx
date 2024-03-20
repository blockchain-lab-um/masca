import { useTranslations } from 'next-intl';

export const ImageLink = ({ value }: { value: string }) => {
  const t = useTranslations('ImageLink');

  return (
    <div>
      <h2 className="dark:text-navy-blue-200 pr-2 font-bold text-gray-800">
        {t('image')}:
      </h2>
      <div className="flex flex-row">
        <a
          href={`${
            process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io'
          }/ipfs/${value.toString().slice('ipfs://'.length)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-md animated-transition dark:text-navy-blue-300 cursor-pointer font-normal text-gray-700 underline underline-offset-2"
        >
          {value.length > 32 ? value.slice('ipfs://'.length, 32) : value}
        </a>
      </div>
    </div>
  );
};
