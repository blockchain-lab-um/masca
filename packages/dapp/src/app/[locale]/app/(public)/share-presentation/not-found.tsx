import { useTranslations } from 'next-intl';

import BasicNotFound from '@/components/BasicNotFound';

export default function NotFound() {
  const t = useTranslations('NotFoundPresentation');
  return <BasicNotFound text={t('title')} />;
}
