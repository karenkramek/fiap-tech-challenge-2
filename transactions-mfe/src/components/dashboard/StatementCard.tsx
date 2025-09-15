import React from "react";
import Card from "@/components/ui/Card";
import TransactionBadge from "@/components/ui/TransactionBadge";
import { Transaction } from "@/models/Transaction";
import { getMonthName, formatDate } from "@/utils/utils";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrencyWithSymbol } from "@/utils/currencyUtils";

interface StatementCardProps {
  grouped: Record<string, Transaction[]>;
  sortedKeys: string[];
  recentTransactions: Transaction[];
}

const StatementCard: React.FC<StatementCardProps> = ({
  grouped,
  sortedKeys,
  recentTransactions,
}) => (
  <div className="sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1 space-y-6">
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="transactions-title text-primary-700">Extrato</h2>
        <div className="flex space-x-2 item-center">
          <Link href="/transactions">
            <Edit className="h-5 w-5 text-white-800 hover:text-primary-700 cursor-pointer" />
          </Link>
          <Link href="/transactions">
            <Trash2 className="h-5 w-5 text-white-800 hover:text-error-700 cursor-pointer" />
          </Link>
        </div>
      </div>
      {recentTransactions.length > 0 ? (
        <div>
          {sortedKeys.map((key) => {
            const [month, year] = key.split("-");
            return (
              <div key={key} className="mb-6">
                <h3 className="transactions-subtitle font-medium text-primary-700 mb-2">
                  {getMonthName(month)} {year}
                </h3>
                <div className="space-y-2">
                  {grouped[key].map((transaction) => (
                    <div key={transaction.id} className="flex justify-between py-2 border-b">
                      <div>
                        <TransactionBadge type={transaction.type} />
                        <p className="text-xs text-white-800 mt-1">
                          {transaction.description || "Sem descrição"}
                        </p>
                      </div>
                      <div className="transactions-description text-right">
                        <p
                          className={`text-sm font-medium ${
                            transaction.isIncome()
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.isIncome() ? "+" : "-"}{" "}
                          {formatCurrencyWithSymbol(transaction.amount)}
                        </p>
                        <p className="text-xs text-white-800">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-white-800">Nenhuma transação registrada.</p>
      )}
    </Card>
  </div>
);

export default StatementCard;
