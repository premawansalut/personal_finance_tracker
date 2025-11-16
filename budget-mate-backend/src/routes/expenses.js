const express = require('express');
const router = express.Router();
const db = require('../db');
const { expenseSchema } = require('../validators');

// POST /api/expenses
router.post('/', async (req, res) => {
  const { error, value } = expenseSchema.validate(req.body, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const { amount, category, note, year, month } = req.body;

  try {

    let createdAt;
    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month);
      if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({ error: 'Invalid year or month' });
      }
      createdAt = new Date(y, m - 1, 1);
    } else {
      createdAt = new Date();
    }

    const insertQuery = `
      INSERT INTO expenses (amount, category, note, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, amount, category, note, created_at;
    `;
    const insertResult = await db.query(insertQuery, [amount, category, note || null, createdAt]);
    const newExpense = insertResult.rows[0];

    // Get total expense for that month/year
    const startDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
    const endDate = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 0, 23, 59, 59);

    const totalQuery = `
      SELECT COALESCE(SUM(amount),0)::NUMERIC(12,2) AS total_expense
      FROM expenses
      WHERE created_at >= $1 AND created_at <= $2;
    `;
    const totalRes = await db.query(totalQuery, [startDate, endDate]);
    const totalExpense = parseFloat(totalRes.rows[0].total_expense);

    const monthName = createdAt.toLocaleString('default', { month: 'short' });
    const label = `${createdAt.getFullYear()} ${monthName} Expenses`;

    return res.status(201).json({
      data: newExpense,
      label,
      total_expense: totalExpense
    });
  } catch (err) {
    console.error('Insert expense error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//edit
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, note } = req.body;

    // Ensure at least one field to update
    if (!amount && !category && !note) {
      return res.status(400).json({ error: 'No update fields provided' });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (amount) {
      fields.push(`amount = $${idx++}`);
      values.push(amount);
    }
    if (category) {
      fields.push(`category = $${idx++}`);
      values.push(category);
    }
    if (note !== undefined) {
      fields.push(`note = $${idx++}`);
      values.push(note);
    }

    const query = `
      UPDATE expenses
      SET ${fields.join(', ')}, created_at = created_at
      WHERE id = $${idx}
      RETURNING id, amount, category, note, created_at;
    `;
    values.push(id);

    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update expense error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM expenses WHERE id = $1 RETURNING id;`;
    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully', deleted_id: id });
  } catch (err) {
    console.error('Delete expense error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
