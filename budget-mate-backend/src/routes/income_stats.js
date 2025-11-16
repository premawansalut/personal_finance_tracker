
// const express = require('express');
// const router = express.Router();
// const db = require('../db');

// // GET /api/incomes/statistics?year=2025&month=10
// router.get('/', async (req, res) => {
//   try {
//     let { year, month } = req.query;
//     const now = new Date();

//     // Defaults to current month and year
//     year = year ? parseInt(year) : now.getFullYear();
//     month = month ? parseInt(month) : now.getMonth() + 1;

//     if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
//       return res.status(400).json({ error: 'Invalid year or month' });
//     }

//     // Build range for selected month
//     const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
//     const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

//     const query = `
//       SELECT 
//         category,
//         COALESCE(SUM(amount),0)::NUMERIC(12,2) AS total
//       FROM incomes
//       WHERE created_at >= $1 AND created_at <= $2
//       GROUP BY category
//       ORDER BY total DESC;
//     `;

//     const { rows } = await db.query(query, [startDate, endDate]);

//     const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
//     const label = `${year} ${monthName}`;

//     if (rows.length === 0) {
//       return res.status(404).json({
//         label,
//         message: `No income data found for ${monthName} ${year}`,
//         categories: []
//       });
//     }

//     return res.json({
//       label,
//       categories: rows
//     });
//   } catch (err) {
//     console.error('Income statistics error', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/incomes/statistics?year=2025&month=9
router.get('/', async (req, res) => {
  try {
    let { year, month } = req.query;
    const now = new Date();

    // Default to current month/year if not provided
    year = year ? parseInt(year) : now.getFullYear();
    month = month ? parseInt(month) : now.getMonth() + 1;

    // Validate
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Create date range for that month/year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Query category-wise totals for that month/year
    const query = `
      SELECT 
        category,
        COALESCE(SUM(amount), 0)::NUMERIC(12,2) AS total
      FROM incomes
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY category
      ORDER BY total DESC;
    `;

    const { rows } = await db.query(query, [startDate, endDate]);

    // Format response label
    const monthName = startDate.toLocaleString('default', { month: 'short' });
    const label = `${year} ${monthName}`;

    if (rows.length === 0) {
      return res.status(404).json({
        label,
        message: `No income data found for ${monthName} ${year}`,
        categories: []
      });
    }

    // Calculate total for the month
    const total = rows.reduce((sum, r) => sum + parseFloat(r.total), 0);

    return res.json({
      label,
      total_balance: total,
      categories: rows
    });
  } catch (err) {
    console.error('Income statistics error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
