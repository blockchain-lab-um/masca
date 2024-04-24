import { cn } from '@/utils/shadcn';

export const TextSkeleton = ({
  className = 'h-2 w-48',
}: {
  className?: string;
}) => (
  <div role="status" className="max-w-sm animate-pulse">
    <div className={cn(className, 'rounded-lg bg-gray-200 dark:bg-gray-700')} />
  </div>
);
