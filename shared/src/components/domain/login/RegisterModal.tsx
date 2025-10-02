import React, { useState } from 'react';
import Button from '../../ui/Button';
import ModalWrapper from '../../ui/ModalWrapper';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (data: RegisterFormData) => void;
  onSwitchToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterModal({ open, onClose, onRegister, onSwitchToLogin, onRegisterSuccess }: RegisterModalProps) {
  const [formValues, setFormValues] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setFormErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!value) {
      setFormErrors((prev) => ({ ...prev, [id]: 'Este campo é obrigatório' }));
    }
  };

  const handleClose = () => {
    onClose();
    setFormValues({ name: '', email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (formValues.email === 'error@example.com') {
        setError('Este email já está cadastrado');
      } else {
        setSuccess('Conta criada com sucesso!');
        onRegister(formValues);
        onRegisterSuccess?.();
        handleClose();
      }
    }, 2000);
  };

  if (!open) return null;

  return (
    <ModalWrapper open={open} onClose={handleClose} title="Criar nova conta" size="sm">
      <p className="modal-text mb-4 text-primary-700">Crie sua conta ByteBank gratuitamente</p>
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
        <strong>Atenção:</strong> Ao criar uma nova conta, você começará com saldo zero e histórico de transações limpo.
      </div>
      <div className="relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-primary-700 mb-1">Nome Completo*</label>
            <input
              type="text"
              id="name"
              value={formValues.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite seu nome completo"
              className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none text-primary-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-700 ${formErrors.name ? 'border-red-500' : 'border-primary-700'}`}
              required
              disabled={loading}
            />
            {formErrors.name && <span className="text-xs text-red-600 mt-1 block">{formErrors.name}</span>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-primary-700 mb-1">Email*</label>
            <input
              type="email"
              id="email"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="seu.email@exemplo.com"
              className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none text-primary-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-700 ${formErrors.email ? 'border-red-500' : 'border-primary-700'}`}
              required
              disabled={loading}
            />
            {formErrors.email && <span className="text-xs text-red-600 mt-1 block">{formErrors.email}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-primary-700 mb-1">Senha*</label>
            <input
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite sua senha (mínimo 6 caracteres)"
              className={`w-full px-4 py-3 rounded-lg text-primary-700 border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 ${formErrors.password ? 'border-red-500' : 'border-primary-700'}`}
              required
              disabled={loading}
              minLength={6}
            />
            {formErrors.password && <span className="text-xs text-red-600 mt-1 block">{formErrors.password}</span>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-primary-700 mb-1">Confirmar Senha*</label>
            <input
              type="password"
              id="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite novamente sua senha"
              className={`w-full px-4 py-3 rounded-lg text-primary-700 border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 ${formErrors.confirmPassword ? 'border-red-500' : 'border-primary-700'}`}
              required
              disabled={loading}
            />
            {formErrors.confirmPassword && <span className="text-xs text-red-600 mt-1 block">{formErrors.confirmPassword}</span>}
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading} className="w-full py-3 rounded-lg">Cancelar</Button>
            <Button type="submit" variant="active" className="w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md" disabled={loading}>
              Criar conta
            </Button>
          </div>
        </form>
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
            <LoadingSpinner size={48} />
            <span className="text-primary-700 font-semibold text-lg mt-4">Criando conta...</span>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
            onClick={() => {
              handleClose();
              if (onSwitchToLogin) {
                onSwitchToLogin();
              }
            }}
          >
            Fazer login
          </button>
        </p>
      </div>
    </ModalWrapper>
  );
}