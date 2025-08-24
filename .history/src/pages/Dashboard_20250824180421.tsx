import React, { useState } from "react";
import { useFinance } from "../contexts/FinanceContext";

function groupTransactionsBy(transactions, key) {
  return transactions.reduce((result, transaction) => {
    const groupKey = transaction[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(transaction);
    return result;
  }, {});
}

function getVariationKey(type) {
  if (type === "income") return "Revenu";
  if (type === "expense") return "Dépense";
  return "Autre";
}

export default function Dashboard() {
  const { transactions, categories, balance } = useFinance();
  const [showDetails, setShowDetails] = useState(false);

  const currentMonth = new Date().getMonth();
  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date).getMonth() === currentMonth
  );

  const grouped = groupTransactionsBy(monthlyTransactions, "type");
  const income = grouped["income"]?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const expense = grouped["expense"]?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const variation = income - expense;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p>💰 Solde actuel : <strong>{balance.toFixed(2)} CFA</strong></p>
        <p>📈 Revenu du mois : <strong>{income.toFixed(2)} CFA</strong></p>
        <p>📉 Dépense du mois : <strong>{expense.toFixed(2)} CFA</strong></p>
        <p>📊 Variation : 
          <strong className={variation >= 0 ? "text-green-600" : "text-red-600"}>
            {variation.toFixed(2)} CFA
          </strong>
        </p>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        {showDetails ? "Masquer les détails" : "Afficher les détails"}
      </button>

      {showDetails && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Détails des transactions</h2>
          {Object.keys(grouped).map((type) => (
            <div key={type} className="mb-4">
              <h3 className="font-bold">{getVariationKey(type)}</h3>
              <ul className="list-disc pl-5">
                {grouped[type].map((t) => {
                  const category = categories.find((c) => c.id === t.categoryId);
                  return (
                    <li key={t.id}>
                      {t.date} - {t.amount} CFA ({category?.name || "Sans catégorie"})
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
