// Tipos dos módulos remotos do shared para uso com Module Federation no investments-mfe.
// Mantenha este arquivo atualizado para garantir tipagem ao importar do shared.
// Só é necessário para o TypeScript (não afeta o runtime).

declare module 'shared/hooks/useTransactions';
declare module 'shared/hooks/useAccount';
declare module 'shared/hooks/useModal';
declare module 'shared/hooks/useGroupedTransactions';
declare module 'shared/hooks/useAuthProtection';

declare module 'shared/components/ui/Button';
declare module 'shared/components/ui/Card';
declare module 'shared/components/ui/Icon';
declare module 'shared/components/ui/ConfirmationModal';
declare module 'shared/components/ui/ModalWrapper';
declare module 'shared/components/domain/transaction/TransactionAdd';
declare module 'shared/components/domain/transaction/TransactionTypeBadge';
declare module 'shared/components/domain/transaction/TransactionList';
declare module 'shared/components/domain/transaction/TransactionEdit';
declare module 'shared/components/domain/file/AttachmentDisplay';
declare module 'shared/components/domain/file/FilePreviewModal';
declare module 'shared/components/domain/file/FileUpload';
declare module 'shared/components/domain/BalanceCard';
declare module 'shared/components/ui/FeedbackProvider';
declare module 'shared/components/ui/ErrorBoundary';
declare module 'shared/components/ui/LoadingSpinner';
declare module 'shared/components/ui/ModalCloseButton';

declare module 'shared/models/Transaction';
declare module 'shared/models/Account';
declare module 'shared/types/TransactionType';
declare module 'shared/utils/date';
declare module 'shared/utils/currency';
declare module 'shared/services/AccountService';
declare module 'shared/services/TransactionService';
declare module 'shared/services/api';
declare module 'shared/dtos/Transaction.dto';
declare module 'shared/dtos/Account.dto';
