import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const showSuccess = (msg: string) => toast.success(msg);
export const showError = (msg: string) => toast.error(msg);
export const showLoading = (msg: string) => toast.loading(msg);
export const dismissLoading = () => toast.dismiss();

const FeedbackProvider: React.FC = () => <Toaster position="top-right" />;

export default FeedbackProvider;
