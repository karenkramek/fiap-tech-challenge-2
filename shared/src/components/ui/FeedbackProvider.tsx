import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const showSuccess = (msg: string, duration?: number) =>
  toast.success(msg, duration ? { duration } : undefined);
export const showError = (msg: string, duration?: number) =>
  toast.error(msg, duration ? { duration } : undefined);
export const showLoading = (msg: string) => toast.loading(msg);
export const dismissLoading = () => toast.dismiss();

const FeedbackProvider: React.FC = () => <Toaster position="top-right" />;

export default FeedbackProvider;
