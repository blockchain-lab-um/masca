import { clsx } from 'clsx';

type ButtonProps = {
  variant:
    | 'primary'
    | 'primary-active'
    | 'secondary-active'
    | 'secondary'
    | 'connect'
    | 'gray'
    | 'warning'
    | 'white'
    | 'white-pink';
  size?: 'popup' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'wd' | 'icon';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

const variants: Record<string, string> = {
  primary:
    'bg-pink-500 dark:bg-orange-accent-dark dark:text-navy-blue-900  hover:opacity-80 text-white',
  'primary-active':
    'text-orange-500 border border-orange-500 bg-white hover:text-white hover:bg-orange-500',
  secondary:
    'border-2 border-navy-blue-900 text-navy-blue-900 hover:bg-navy-blue-100/20 dark:border-navy-blue-200 dark:text-navy-blue-200 animated-transition',
  'secondary-active':
    'text-navy-blue-500 border border border-navy-blue-500 hover:text-white hover:bg-navy-blue-500',
  connect: 'bg-pink-100 hover:bg-pink-50 text-pink-600',
  gray: 'bg-gray-200 text-gray-800 hover:opacity-80 dark:bg-navy-blue-700 dark:text-white',
  'white-pink':
    'bg-white text-gray-800 hover:text-white hover:bg-pink-400 dark:bg-orange-accent-dark dark:text-gray-900 dark:hover:bg-orange-accent-dark/80',
  white: 'bg-white text-gray-800 hover:opacity-80',
  warning: 'bg-red-500 hover:bg-red-500/90 text-white justify-center',
};

const sizes: Record<string, string> = {
  popup: 'text-sm py-2 px-3.5',
  xs: 'text-sm py-2.5 px-4',
  sm: 'text-h5 py-2.5 px-5',
  md: 'text-h4 py-2.5 px-7',
  lg: 'text-2xl py-2 px-8 font-semibold',
  xl: 'text-h3 py-2.5 px-9 font-semibold',
  wd: 'text-h4 py-2.5 px-7',
  icon: 'py-2 px-2',
};

const loaderSizes: Record<string, string> = {
  popup: 'w-4 h-4 border-2',
  xs: 'w-4 h-4 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-4 h-4 border-2',
  lg: 'w-6 h-6 border-2',
  xl: 'w-8 h-6 border-2',
  wd: 'w-8 h-8 border-2',
  icon: 'w-4 h-4 border-2',
};

const loaderColors: Record<string, string> = {
  primary: 'border-white dark:border-navy-blue-900',
  'primary-active': 'border-orange-500',
  secondary: 'border-white',
  'secondary-active': 'border-navy-blue-500',
  connect: 'border-pink-500',
  gray: 'border-gray-800',
  white: 'border-gray-800',
  warning: 'border-white',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  shadow = '',
  onClick,
  children,
  disabled = false,
  loading = false,
}: ButtonProps) => {
  return (
    <div className="rounded-ful">
      <button
        className={`${clsx(
          variants[variant],
          sizes[size],
          `shadow-${shadow}`,
          'animated-transition font-ubuntu flex max-w-xs items-center gap-x-2 rounded-full font-medium'
        )}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
        {loading && (
          <div className="flex">
            <div
              className={clsx(
                loaderSizes[size],
                'ml-1 animate-spin rounded-full border-solid border-t-pink-900/0',
                loaderColors[variant]
              )}
            ></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default Button;
