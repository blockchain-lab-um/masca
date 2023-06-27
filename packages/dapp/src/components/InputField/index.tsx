import clsx from 'clsx';

interface InputFieldProps {
  variant?: 'primary' | 'secondary' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | '2xl' | 'xl' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

const variants = {
  primary: 'text-gray-800 dark:text-navy-blue-200 border-gray-400 placeholder:text-gray-500 border-2 dark:border-navy-blue-400 dark:bg-navy-blue-800 dark:placeholder:text-navy-blue-500 focus:ring-2 focus:ring-pink-500/50 focus:border-gray-300/0 dark:focus:border-gray-300/0 dark:focus:ring-orange-accent-dark/70 ',
  secondary: 'text-navy-blue-500 border-navy-blue-300',
  gray: 'text-gray-800 border-gray-300 border-2 bg-white dark:bg-navy-blue-200 dark:border-navy-blue-500 dark:text-navy-blue-800 dark:placeholder-navy-blue-600 ',
};

const sizes = {
  sm: 'text-xs py-1 pl-2',
  md: 'text-sm py-1.5 pl-2',
  lg: 'text-sm py-2 pl-2 font-semibold',
};

const InputField = ({
  variant = 'primary',
  size = 'md',
  placeholder = '',
  value,
  setValue,
  disabled = false,
  shadow = 'lg',
  rounded = 'full',
}: InputFieldProps) => (
  <input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className={clsx(
      variants[variant],
      sizes[size],
      `rounded-${rounded}`,
      `shadow-${shadow}`,
      'ring-none border-1 animated-transition w-full border outline-none '
    )}
  />
);

export default InputField;
