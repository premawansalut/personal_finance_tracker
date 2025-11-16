const express = require('express');
const router = express.Router();
const db = require('../db');
const { incomeSchema } = require('../validators');

// POST /api/income

router.post('/', async (req, res) => {
  const { error, value } = incomeSchema.validate(req.body, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const { amount, category, note } = value;
  const { year, month } = req.body;

  try {
   

    let createdAt;
    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month);
      if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({ error: 'Invalid year or month' });
      }
      createdAt = new Date(y, m - 1, 1); // first day of that month
    } else {
      createdAt = new Date(); // def current date
    }

    const insertQuery = `
      INSERT INTO incomes (amount, category, note, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, amount, category, note, created_at;
    `;

    const insertResult = await db.query(insertQuery, [amount, category, note || null, createdAt]);
    const newIncome = insertResult.rows[0];

    // total balance for that month/year
    const startDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
    const endDate = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 0, 23, 59, 59);
    const totalQuery = `
      SELECT COALESCE(SUM(amount), 0) AS total_balance
      FROM incomes
      WHERE created_at >= $1 AND created_at <= $2;
    `;
    const totalRes = await db.query(totalQuery, [startDate, endDate]);
    const totalBalance = parseFloat(totalRes.rows[0].total_balance);

    const monthName = createdAt.toLocaleString('default', { month: 'short' });
    const label = `${createdAt.getFullYear()} ${monthName} Balance`;

    return res.status(201).json({
      data: newIncome,
      label,
      total_balance: totalBalance
    });
  } catch (err) {
    console.error('Insert income error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
