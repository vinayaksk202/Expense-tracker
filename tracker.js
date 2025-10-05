function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

function loadDashboard() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById('username').innerText = user;
  updateDashboard();
}

function addTransaction() {
  const text = document.getElementById('text').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const user = getCurrentUser();

  if (!text || isNaN(amount)) {
    alert("Please enter valid details");
    return;
  }

  let users = JSON.parse(localStorage.getItem('users'));
  let transaction = {
    id: Date.now(),
    text,
    amount
  };

  users[user].transactions.push(transaction);
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('text').value = '';
  document.getElementById('amount').value = '';
  updateDashboard();
}

function updateDashboard() {
  const user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem('users'));
  let transactions = users[user].transactions;

  let balance = 0, income = 0, expense = 0;

  const recentList = document.getElementById('recentList');
  recentList.innerHTML = '';

  transactions.slice(-5).reverse().forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount < 0 ? 'minus' : 'plus');
    li.textContent = `${t.text} : ₹${t.amount}`;
    recentList.appendChild(li);

    if (t.amount > 0) income += t.amount;
    else expense += Math.abs(t.amount);
    balance += t.amount;
  });

  document.getElementById('balance').innerText = `₹${balance}`;
  document.getElementById('income').innerText = `₹${income}`;
  document.getElementById('expense').innerText = `₹${expense}`;
}

function loadHistory() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem('users'));
  let transactions = users[user].transactions;

  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

  transactions.slice().reverse().forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount < 0 ? 'minus' : 'plus');
    li.textContent = `${t.text} : ₹${t.amount}`;
    historyList.appendChild(li);
  });
}
