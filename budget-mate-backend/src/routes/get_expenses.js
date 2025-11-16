const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/expenses/get_expenses?year=2025&month=10
router.get('/', async (req, res) => {
  try {
    let { year, month } = req.query;
    const now = new Date();

    // Default to current year/month
    year = year ? parseInt(year) : now.getFullYear();
    month = month ? parseInt(month) : now.getMonth() + 1;

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Define range for that month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const query = `
      SELECT 
        id, category, amount, note, created_at
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2
      ORDER BY created_at DESC;
    `;
    const { rows } = await db.query(query, [startDate, endDate]);

    // Calculate total
    const total = rows.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const monthName = startDate.toLocaleString('default', { month: 'short' });
    const label = `${year} ${monthName} Expenses`;

    // Always return consistent JSON
    return res.json({
      label,
      total_expense: total,
      expenses: rows
    });
  } catch (err) {
    console.error('Fetch expenses error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
