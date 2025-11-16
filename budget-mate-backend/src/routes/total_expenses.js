const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/expenses/total_expenses?year=2025&month=10
router.get('/', async (req, res) => {
  try {
    let { year, month } = req.query;
    const now = new Date();

    // Default to current month/year
    year = year ? parseInt(year) : now.getFullYear();
    month = month ? parseInt(month) : now.getMonth() + 1;

    // val month and year
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // cal date range for given month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const query = `
      SELECT COALESCE(SUM(amount), 0)::NUMERIC(12,2) AS total_expense
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2;
    `;
    const { rows } = await db.query(query, [startDate, endDate]);
    const totalExpense = parseFloat(rows[0].total_expense);

    const monthName = startDate.toLocaleString('default', { month: 'short' });
    const label = `${year} ${monthName} Total Expenses`;

    return res.json({
      label,
      total_expense: totalExpense
    });
  } catch (err) {
    console.error('Fetch total expenses error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
