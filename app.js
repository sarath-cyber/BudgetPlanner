const db = require('./firebase');

// Example: Add a transaction
db.addTransaction('Groceries', 50.25, '2024-06-10')
  .then(id => {
    console.log('Transaction added with ID:', id);
  })
  .catch(err => {
    console.error('Error adding transaction:', err);
  });

// Example: Retrieve all transactions
db.getTransactions()
  .then(transactions => {
    console.log('All transactions:', transactions);
  })
  .catch(err => {
    console.error('Error retrieving transactions:', err);
  });