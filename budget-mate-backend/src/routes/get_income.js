const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/incomes/get_income?year=2025&month=10
router.get('/', async (req, res) => {
  try {
    let { year, month } = req.query;
    const now = new Date();

    // Default to current month/year if not provided
    year = year ? parseInt(year) : now.getFullYear();
    month = month ? parseInt(month) : now.getMonth() + 1;

    // Validate inputs
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Build range for month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Fetch income records for month/year
    const query = `
      SELECT id, category, amount, note, created_at
      FROM incomes
      WHERE created_at >= $1 AND created_at <= $2
      ORDER BY created_at DESC;
    `;
    const { rows } = await db.query(query, [startDate, endDate]);

    // Calculate total
    const totalIncome = rows.reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const monthName = startDate.toLocaleString('default', { month: 'short' });
    const label = `${year} ${monthName} Incomes`;

    return res.json({
      label,
      total_income: totalIncome,
      incomes: rows
    });
  } catch (err) {
    console.error('Fetch income error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
