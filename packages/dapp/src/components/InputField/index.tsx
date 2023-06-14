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
  primary: 'text-orange-500 border-gray-300',
  secondary: 'text-navy-blue-500 border-navy-blue-300',
  gray: 'text-gray-800 border-gray-300 border-2 bg-white dark:bg-navy-blue-200 dark:border-navy-blue-500 dark:text-navy-blue-800 dark:placeholder-navy-blue-600 ',
};

const sizes = {
  sm: 'text-xs py-1 px-3',
  md: 'text-sm py-1.5 px-4',
  lg: 'text-md py-2 px-5 font-semibold',
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
