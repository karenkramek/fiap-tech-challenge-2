import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import AttachmentDisplay from "shared/components/AttachmentDisplay";
import Button from "shared/components/Button";
import Card from "shared/components/Card";
import ConfirmationModal from "shared/components/ConfirmationModal";
import EditTransactionModal from "shared/components/EditTransactionModal";
import FileUpload from "shared/components/FileUpload";
import TransactionBadge from "shared/components/TransactionBadge";
import { useTransactions } from "shared/hooks/useTransactions";
import { TransactionType } from "shared/types/TransactionType";
import { createCurrencyInputHandler, formatCurrencyWithSymbol, parseCurrencyStringToNumber } from "shared/utils/currencyUtils";
import { formatDate, getMonthKey, getMonthName } from "shared/utils/utils";

const TransactionsPage: React.FC = () => {
   const { transactions, loading, deleteTransaction, fetchTransactions, addTransaction } =
      useTransactions();
   const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
   );

   const [modalOpen, setModalOpen] = React.useState(false);
   const [transactionToDelete, setTransactionToDelete] = React.useState<
      string | null
   >(null);
   const [editModalOpen, setEditModalOpen] = React.useState(false);
   const [transactionToEdit, setTransactionToEdit] = React.useState<
      string | null
   >(null);
   const [addModalOpen, setAddModalOpen] = React.useState(false);

   // Estados do formulário de nova transação
   const [amount, setAmount] = React.useState<string>("");
   const [attachmentFile, setAttachmentFile] = React.useState<File | null>(null);
   const [transactionType, setTransactionType] = React.useState<TransactionType>(TransactionType.DEPOSIT);
   const [description, setDescription] = React.useState<string>("");
   const [formLoading, setFormLoading] = React.useState(false);

   // Handler reutilizável para campo de valor monetário
   const handleAmountChange = createCurrencyInputHandler(setAmount);

   // Exclui uma transação
   const handleDelete = async () => {
      if (transactionToDelete) {
         try {
            await deleteTransaction(transactionToDelete);
            setModalOpen(false);
            setTransactionToDelete(null);
         } catch (error) {
            if (typeof window !== "undefined") {
               console.error("Erro ao excluir transação.");
            }
            console.error(error);
         }
      }
   };

   // Abre modal de exclusão
   const openDeleteModal = (id: string) => {
      setTransactionToDelete(id);
      setModalOpen(true);
   };

   // Fecha modal de exclusão
   const closeDeleteModal = () => {
      setModalOpen(false);
      setTransactionToDelete(null);
   };

   // Abre modal de edição
   const openEditModal = (id: string) => {
      setTransactionToEdit(id);
      setEditModalOpen(true);
   };

   // Fecha modal de edição
   const closeEditModal = () => {
      setEditModalOpen(false);
      setTransactionToEdit(null);
   };

   // Submete nova transação
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormLoading(true);

      try {
         const numericAmount = parseCurrencyStringToNumber(amount);

         if (numericAmount <= 0) {
            toast.error("O valor deve ser maior que zero");
            return;
         }

         await addTransaction(
            transactionType,
            numericAmount,
            new Date(),
            description
         );

         // Limpa o formulário após sucesso
         setAmount("");
         setDescription("");
         setAttachmentFile(null);
         setTransactionType(TransactionType.DEPOSIT);
         setAddModalOpen(false);

         toast.success("Transação criada com sucesso!");
      } catch (error) {
         console.error("Erro ao criar transação:", error);
         toast.error("Erro ao criar transação");
      } finally {
         setFormLoading(false);
      }
   };

   // Agrupa transações por mês
   const groupTransactionsByMonth = () => {
      const grouped: Record<string, typeof transactions> = {};

      sortedTransactions.forEach((transaction) => {
         const date = new Date(transaction.date);
         const monthKey = getMonthKey(date);

         if (!grouped[monthKey]) {
            grouped[monthKey] = [];
         }

         grouped[monthKey].push(transaction);
      });

      // Ordena meses do mais recente para o mais antigo
      const sortedKeys = Object.keys(grouped).sort((a, b) => {
         const [monthA, yearA] = a.split("-").map(Number);
         const [monthB, yearB] = b.split("-").map(Number);

         if (yearA !== yearB) {
            return yearB - yearA;
         }

         return monthB - monthA;
      });

      // Ordena transações dentro de cada mês
      for (const key of sortedKeys) {
         grouped[key] = grouped[key].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
         );
      }

      return { grouped, sortedKeys };
   };

   const { grouped, sortedKeys } = groupTransactionsByMonth();

   if (loading) {
      return (
         <div className="flex justify-center items-center h-64">
            <p className="transactions-loading">Carregando...</p>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <Card>
            <div className="flex justify-between items-center mb-6">
               <h1 className="transactions-title text-primary-700">Extrato</h1>
               {/* <Link to="/transactions"> */}
               <Button variant="primary" onClick={() => setAddModalOpen(true)}>Nova Transação</Button>
               {/* </Link> */}
            </div>
            <div className="space-y-6">
               {transactions.length > 0 ? (
                  sortedKeys.map((key) => {
                     const [month, year] = key.split("-").map(Number);
                     const monthName = getMonthName(month);

                     return (
                        <div key={key} className="space-y-3">
                           <h2 className="text-lg font-semibold text-gray-600 border-b border-gray-200 pb-2">
                              {monthName} {year}
                           </h2>

                           <div className="space-y-2">
                              {grouped[key].map((transaction) => (
                                 <div
                                    key={transaction.id}
                                    className="bg-white border-b-4 border-gray-200 p-4 shadow-sm"
                                 >
                                    <div className="flex justify-between items-start">
                                       <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                             <TransactionBadge
                                                type={transaction.type}
                                             />
                                             <span className="text-sm text-gray-500">
                                                {formatDate(transaction.date)}
                                             </span>
                                          </div>
                                          <p className="text-gray-700 text-sm mb-2">
                                             {transaction.description ||
                                                "Sem descrição"}
                                          </p>
                                          {transaction.attachmentPath && (
                                             <div className="mt-2">
                                                <AttachmentDisplay
                                                   attachmentPath={
                                                      transaction.attachmentPath
                                                   }
                                                   {...({
                                                      transactionType:
                                                         transaction.type,
                                                   } as any)}
                                                   className="text-xs"
                                                />
                                             </div>
                                          )}
                                       </div>

                                       <div className="flex flex-col items-end gap-2 ml-4">
                                          <div className="flex space-x-2 justify-end">
                                             <button
                                                className="p-1 hover:bg-primary-50 rounded"
                                                title="Editar"
                                                onClick={() =>
                                                   openEditModal(transaction.id)
                                                }
                                             >
                                                <Edit className="h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer" />
                                             </button>
                                             <button
                                                className="p-1 hover:bg-error-50 rounded"
                                                title="Excluir"
                                                onClick={() =>
                                                   openDeleteModal(
                                                      transaction.id
                                                   )
                                                }
                                             >
                                                <Trash2 className="h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer" />
                                             </button>
                                          </div>
                                          <p
                                             className={`text-lg font-semibold text-right ${
                                                transaction.isIncome()
                                                   ? "text-green-600"
                                                   : "text-red-600"
                                             }`}
                                          >
                                             {transaction.isIncome() ? "" : "-"}{" "}
                                             {formatCurrencyWithSymbol(
                                                transaction.amount
                                             )}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="transactions-empty">
                     <p className="transactions-empty-title mb-2">
                        Nenhuma transação encontrada.
                     </p>
                     <Link to="/dashboard">
                        <Button variant="primary">
                           Adicionar nova transação
                        </Button>
                     </Link>
                  </div>
               )}
            </div>
         </Card>

         {/* Modal de confirmação de exclusão */}
         {modalOpen && (
            <ConfirmationModal
               open={modalOpen}
               title="Confirmar exclusão"
               description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
               confirmText="Excluir"
               cancelText="Cancelar"
               onConfirm={handleDelete}
               onCancel={closeDeleteModal}
               loading={false}
            />
         )}

         {/* Modal de edição de transação */}
         <EditTransactionModal
            open={editModalOpen}
            onClose={closeEditModal}
            transactionId={transactionToEdit}
            onSuccess={fetchTransactions}
         />

         {/* Modal de nova transação */}
         {addModalOpen && (
            <div className="fixed inset-0 !m-0 modal-overlay flex items-center justify-center z-50">
               <div className="modal-content relative" style={{ maxWidth: '32rem' }}>
                  <button
                     className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
                     onClick={() => setAddModalOpen(false)}
                     aria-label="Fechar"
                  >
                     ×
                  </button>
                  <h2 className="modal-title">Nova Transação</h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                     <div>
                        <label htmlFor="type" className="block text-sm font-medium text-primary-700 mb-1">Tipo de Transação*</label>
                        <select
                           id="type"
                           value={transactionType}
                           onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                           className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700 bg-white-50"
                           required
                        >
                           <option value={TransactionType.DEPOSIT}>Depósito</option>
                           <option value={TransactionType.WITHDRAWAL}>Saque</option>
                           <option value={TransactionType.TRANSFER}>Transferência</option>
                           <option value={TransactionType.PAYMENT}>Pagamento</option>
                        </select>
                     </div>

                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-primary-700 mb-1">Valor*</label>
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white-800">R$</span>
                           <input
                              type="text"
                              id="amount"
                              value={amount}
                              onChange={handleAmountChange}
                              placeholder="0,00"
                              inputMode="decimal"
                              className="w-full pl-12 pr-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
                              required
                           />
                        </div>
                     </div>

                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-primary-700 mb-1">Descrição (opcional)</label>
                        <input
                           type="text"
                           id="description"
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           placeholder="Descrição da transação"
                           className="w-full px-4 py-3 rounded-lg border border-primary-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-700"
                        />
                     </div>

                     <FileUpload
                        onFileSelect={setAttachmentFile}
                        selectedFile={attachmentFile}
                        disabled={formLoading}
                     />

                     <div className="flex gap-4 pt-4">
                        <Button
                           type="button"
                           variant="secondary"
                           onClick={() => setAddModalOpen(false)}
                           disabled={formLoading}
                        >
                           Cancelar
                        </Button>
                        <Button
                           type="submit"
                           variant="active"
                           className="bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium"
                           disabled={formLoading}
                        >
                           {formLoading ? 'Criando...' : 'Criar Transação'}
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default TransactionsPage;
