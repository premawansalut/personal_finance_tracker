const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/balance/month_year?year=2025&month=10
router.get('/', async (req, res) => {
  try {
    let { year, month } = req.query;
    const now = new Date();

    // Default to current month/year
    year = year ? parseInt(year) : now.getFullYear();
    month = month ? parseInt(month) : now.getMonth() + 1;

    // Validation
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Date range for month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Query total income for month
    const incomeQuery = `
      SELECT COALESCE(SUM(amount), 0)::NUMERIC(12,2) AS total_income
      FROM incomes
      WHERE created_at >= $1 AND created_at <= $2;
    `;
    const incomeRes = await db.query(incomeQuery, [startDate, endDate]);
    const totalIncome = parseFloat(incomeRes.rows[0].total_income);

    // Query total expense for month
    const expenseQuery = `
      SELECT COALESCE(SUM(amount), 0)::NUMERIC(12,2) AS total_expense
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2;
    `;
    const expenseRes = await db.query(expenseQuery, [startDate, endDate]);
    const totalExpense = parseFloat(expenseRes.rows[0].total_expense);

    // Calculate net balance
    const netBalance = totalIncome - totalExpense;

    const monthName = startDate.toLocaleString('default', { month: 'short' });
    const label = `${year} ${monthName} Balance`;

    return res.json({
      label,
      total_income: totalIncome,
      total_expense: totalExpense,
      net_balance: netBalance
    });
  } catch (err) {
    console.error('Fetch balance error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
