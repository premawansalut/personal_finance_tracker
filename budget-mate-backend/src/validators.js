const Joi = require('joi');

const allowedCategories = [
  'Salary',
  'Invest',
  'Business',
  'Interest',
  'Extra Income',
  'Other'
];

const allowedExpenseCategories = [
  'Food',
  'Social',
  'Traffic',
  'Shopping',
  'Grocery',
  'Education',
  'Bills',
  'Rental',
  'Medical',
  'Investment',
  'Gift',
  'Other'
];


const incomeSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  category: Joi.string().valid(...allowedCategories).required(),
  note: Joi.string().max(1000).allow(null, '')
});

const expenseSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  category: Joi.string().valid(...allowedExpenseCategories).required(),
  note: Joi.string().max(1000).allow('', null),
  year: Joi.number().optional(),
  month: Joi.number().optional()
});

module.exports = {
  incomeSchema,
  expenseSchema,
  allowedCategories,
  allowedExpenseCategories
};