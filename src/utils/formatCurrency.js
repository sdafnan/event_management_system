export const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
