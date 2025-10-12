import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const showSuccess = (msg: string, duration?: number) =>
  toast.success(msg, { duration: typeof duration === 'number' ? duration : 3000 });
export const showError = (msg: string, duration?: number) =>
  toast.error(msg, { duration: typeof duration === 'number' ? duration : 3000 });
export const showLoading = (msg: string) => toast.loading(msg);
export const dismissLoading = () => toast.dismiss();

const FeedbackProvider: React.FC = () => (
  <div aria-live="polite" aria-atomic="true">
    <Toaster position="top-right" />
  </div>
);

export default FeedbackProvider;
