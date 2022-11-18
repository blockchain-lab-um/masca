import type { ToastServiceMethods } from 'primevue/toastservice';

export const showError = (
  toast: ToastServiceMethods,
  message: string = 'Message Content'
) => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: message,
    group: 'br',
    life: 3000,
  });
};

export const showSuccess = (
  toast: ToastServiceMethods,
  message: string = 'Message Content'
) => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: message,
    group: 'br',
    life: 3000,
  });
};

/**
 * Function to show a success or error toast message based on the response from the function.
 * For PrimeVue Buttons, will set loading state until the function is complete and then show the toast.
 * If the function return type is void, no toast will be shown.
 * @param toast ToastServiceMethods from PrimeVue
 * @param func function to execute
 * @param loading loading state
 */
export const funcWrapper = async (
  toast: ToastServiceMethods,
  func: Function,
  loading: { value: Boolean }
) => {
  loading.value = true;
  try {
    const successMsg = await func();
    if (typeof successMsg === 'string') showSuccess(toast, successMsg);
  } catch (err: any) {
    showError(toast, err.message);
  }
  loading.value = false;
};

export const ISOtoLocaleString = (ISODateTime: string) => {
  if (!ISODateTime) return;
  return new Date(ISODateTime).toLocaleString('en', {
    hour12: false,
    timeZone: 'UTC',
  });
};

export const copyToClipboard = (val?: string, toast?: ToastServiceMethods) => {
  if (val) {
    navigator.clipboard.writeText(val ?? '');
    toast?.add({
      severity: 'info',
      summary: 'Copied to clipboard',
      group: 'br',
      life: 3000,
    });
    return true;
  }
  return false;
};
