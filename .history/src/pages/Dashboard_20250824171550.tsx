------- SEARCH
  const expensePercentage = totalIncome > 0 ? Math.round((ytotalExpenses / totalIncome) * 100) : 0;
=======
  const expensePercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
+++++++ REPLACE
