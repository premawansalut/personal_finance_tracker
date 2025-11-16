const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/expenses/statistics?year=2025&month=10
router.get('/', async (req, res) => {
  try {
    let { year, month } = req.query;
    const now = new Date();

    // Default to current year/month if not provided
    year = year ? parseInt(year) : now.getFullYear();
    month = month ? parseInt(month) : now.getMonth() + 1;

    // Validate inputs
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Date range for that month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Total Expense
    const totalQuery = `
      SELECT COALESCE(SUM(amount), 0)::NUMERIC(12,2) AS total_expense
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2;
    `;
    const totalRes = await db.query(totalQuery, [startDate, endDate]);
    const totalExpense = parseFloat(totalRes.rows[0].total_expense);

    // Category-wise summary
    const categoryQuery = `
      SELECT category, COALESCE(SUM(amount), 0)::NUMERIC(12,2) AS total
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY category
      ORDER BY total DESC;
    `;
    const categoryRes = await db.query(categoryQuery, [startDate, endDate]);
    const categoryStats = categoryRes.rows;

    // Detailed expense list
    const detailQuery = `
      SELECT id, category, amount, note, created_at
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2
      ORDER BY created_at DESC;
    `;
    const detailRes = await db.query(detailQuery, [startDate, endDate]);
    const expenseDetails = detailRes.rows;

    const monthName = startDate.toLocaleString('default', { month: 'short' });
    const label = `${year} ${monthName} Expense Statistics`;

    return res.json({
      label,
      year,
      month,
      total_expense: totalExpense,
      category_summary: categoryStats,
      expenses: expenseDetails,
    });
  } catch (err) {
    console.error('Expense statistics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
