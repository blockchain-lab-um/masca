import { Switch } from '@headlessui/react';
import clsx from 'clsx';

const variants = {
  primary: 'bg-gray-600',
  gray: 'bg-gray-300',
  secondary: 'bg-white',
};

const variantsEnabled = {
  primary: 'bg-gradient-to-b from-pink-500 to-orange-500',
  gray: 'bg-gray-600',
  secondary: 'bg-orange-100',
};

const variantToggle = {
  primary: 'bg-white',
  gray: 'bg-white',
  secondary: 'bg-orange-500',
};

const sizes = {
  xs: 'h-4 w-8',
  sm: 'h-5 w-10',
  md: 'h-6 w-12',
  lg: 'h-7 w-14',
};

const sizesToggle = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const translateEnabled = {
  xs: 'translate-x-4',
  sm: 'translate-x-5',
  md: 'translate-x-6',
  lg: 'translate-x-7',
};

interface ToggleSwitchProps {
  variant?: 'primary' | 'gray' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner' | '';
  rounded?: 'full' | '2xl' | 'xl' | 'lg' | 'none';
  enabled: boolean;
  setEnabled: (enabled: boolean) => Promise<void> | void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  variant = 'primary',
  size = 'sm',
  shadow = 'sm',
  rounded = 'full',
  enabled,
  setEnabled,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <Switch
      disabled={disabled}
      checked={enabled}
      onChange={setEnabled}
      className={clsx(
        enabled ? variantsEnabled[variant] : variants[variant],
        sizes[size],
        `shadow-${shadow}`,
        `rounded-${rounded}`,
        `border-1 relative inline-flex items-center border border-gray-300`
      )}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={clsx(
          enabled ? translateEnabled[size] : 'translate-x-0.5',
          sizesToggle[size],
          variantToggle[variant],
          `inline-block transform rounded-full border border-gray-200 shadow-sm transition`
        )}
      />
    </Switch>
  );
}
