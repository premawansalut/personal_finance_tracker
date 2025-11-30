// const express = require('express');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// dotenv.config();

// const balanceRouter = require('./routes/balance');
// const balanceMonthYearRouter = require('./routes/balance_month_year');

// const incomesRouter = require('./routes/incomes');
// const getIncomeRouter = require('./routes/get_income');

// const expensesRouter = require('./routes/expenses');
// const getExpensesRouter = require('./routes/get_expenses');
// const totalExpensesRouter = require('./routes/total_expenses');

// //stats
// const incomeStatsRouter = require('./routes/income_stats');
// const expenseStatsRouter = require('./routes/expense_stats');

// //auth

// const { router: authRouter, verifyToken } = require('./routes/auth');

// const db = require('./db');

// const app = express();
// app.use(helmet());
// app.use(morgan('dev'));
// app.use(express.json());

// app.use('/api/balance', balanceRouter);
// app.use('/api/balance/month_year', balanceMonthYearRouter);

// app.use('/api/incomes', incomesRouter);
// app.use('/api/incomes/get_income', getIncomeRouter);

// app.use('/api/expenses', expensesRouter);
// app.use('/api/expenses/get_expenses', getExpensesRouter);
// app.use('/api/expenses/total_expenses', totalExpensesRouter);


// app.use('/api/incomes/statistics', incomeStatsRouter);
// app.use('/api/expenses/statistics', expenseStatsRouter);

// app.use('/api/auth', authRouter);


// app.get('/health', (req, res) => res.json({ ok: true }));

// app.get('/api/user/profile', verifyToken, async (req, res) => {
//   res.json({ message: 'Authorized user', user: req.user });
// });

// const PORT = process.env.PORT || 3000;

// async function start() {
//   // DB connectivity check
//   try {
//     await db.query('SELECT 1');
//   } catch (err) {
//     console.error('Failed to connect to DB', err);
//     process.exit(1);
//   }

//   app.listen(PORT, () => {
//     console.log(`Budget Mate API listening on port ${PORT}`);
//   });
// }

// start();


// src/server.js
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');


if (process.env.NODE_ENV !== 'production') {
  
  require('dotenv').config();
}

const balanceRouter = require('./routes/balance');
const balanceMonthYearRouter = require('./routes/balance_month_year');

const incomesRouter = require('./routes/incomes');
const getIncomeRouter = require('./routes/get_income');

const expensesRouter = require('./routes/expenses');
const getExpensesRouter = require('./routes/get_expenses');
const totalExpensesRouter = require('./routes/total_expenses');

// stats
const incomeStatsRouter = require('./routes/income_stats');
const expenseStatsRouter = require('./routes/expense_stats');

// auth
const { router: authRouter, verifyToken } = require('./routes/auth');

const db = require('./db');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/balance', balanceRouter);
app.use('/api/balance/month_year', balanceMonthYearRouter);

app.use('/api/incomes', incomesRouter);
app.use('/api/incomes/get_income', getIncomeRouter);

app.use('/api/expenses', expensesRouter);
app.use('/api/expenses/get_expenses', getExpensesRouter);
app.use('/api/expenses/total_expenses', totalExpensesRouter);

app.use('/api/incomes/statistics', incomeStatsRouter);
app.use('/api/expenses/statistics', expenseStatsRouter);

app.use('/api/auth', authRouter);

// Health check for Cloud Run
app.get('/health', (req, res) => res.json({ ok: true }));

// Example protected route
app.get('/api/user/profile', verifyToken, async (req, res) => {
  res.json({ message: 'Authorized user', user: req.user });
});

// Cloud Run provides PORT env; default to 8080 (or 3700 for local if you want)
const PORT = process.env.PORT || 8080;

async function start() {
  // Optional: DB connectivity check
  try {
    await db.query('SELECT 1');
    console.log('DB connection OK');
  } catch (err) {
    console.error('Failed to connect to DB at startup', err.message);

  }

  app.listen(PORT, () => {
    console.log(`Budget Mate API listening on port ${PORT}`);
  });
}

start();
