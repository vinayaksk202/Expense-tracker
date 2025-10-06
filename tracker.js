function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

// ------------------ LOAD DASHBOARD ------------------
function loadDashboard() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("username").innerText = user;
  updateDashboard();
}

// ------------------ ADD TRANSACTION ------------------
function addTransaction() {
  const text = document.getElementById("text").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const user = getCurrentUser();

  if (!text || isNaN(amount)) {
    alert("Please enter valid details");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users"));
  if (!users[user].transactions) users[user].transactions = [];

  // Ensure budget values exist
  if (!users[user].budget) users[user].budget = 0;
  if (users[user].remainingBudget === undefined)
    users[user].remainingBudget = users[user].budget;

  // 🔹 Treat every amount as expense (subtract from remaining)
  const expense = Math.abs(amount);

  if (expense > users[user].remainingBudget) {
    alert("You don't have enough remaining budget for this expense!");
    return;
  }

  users[user].remainingBudget -= expense;

  // Save transaction (always negative for expense)
  const transaction = {
    id: Date.now(),
    text,
    amount: -expense, // stored as negative for consistency
    date: new Date().toISOString(),
  };

  users[user].transactions.push(transaction);
  localStorage.setItem("users", JSON.stringify(users));

  // Clear input
  document.getElementById("text").value = "";
  document.getElementById("amount").value = "";

  updateDashboard();
}

// ------------------ SET MONTHLY BUDGET ------------------
function setBudget() {
  const user = getCurrentUser();
  const amount = parseFloat(document.getElementById("budgetInput").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid budget amount");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users"));
  users[user].budget = amount;
  users[user].remainingBudget = amount; // reset
  localStorage.setItem("users", JSON.stringify(users));

  alert("Monthly budget set successfully!");
  updateDashboard();
}

// ------------------ UPDATE DASHBOARD DISPLAY ------------------
function updateDashboard() {
  const user = getCurrentUser();
  const users = JSON.parse(localStorage.getItem("users"));
  const userData = users[user] || {};
  const transactions = userData.transactions || [];

  const budget = userData.budget || 0;
  const remaining = userData.remainingBudget ?? budget;

  // Calculate monthly expenses only
  const currentMonth = new Date().getMonth();
  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date).getMonth() === currentMonth
  );

  let expense = 0;
  let income = 0;
  let balance = 0;

  monthlyTransactions.slice(-5).reverse().forEach((t) => {
    const li = document.createElement("li");
    li.classList.add(t.amount < 0 ? "minus" : "plus");
    li.textContent = `${t.text} : ₹${Math.abs(t.amount)}`;
    document.getElementById("recentList").appendChild(li);

    if (t.amount > 0) income += t.amount;
    else expense += Math.abs(t.amount);
    balance += t.amount;
  });

  // Desired Balance = budget - totalExpense (so we show remaining of budget logic-consistently)
  const totalExpense = expense;
  const computedBalance = budget - totalExpense;

  // Update Display (balance shown as budget - expense)
  document.getElementById("balance").innerText = `₹${computedBalance}`;
  document.getElementById("income").innerText = `₹${budget}`;       // income shows monthly budget
  document.getElementById("expense").innerText = `₹${totalExpense}`;
  document.getElementById("remainingBudget").innerText = `Remaining: ₹${remaining}`;
  // HEADER: show the same as balance
  document.getElementById("monthlyTotal").innerText = `Total: ₹${computedBalance}`;
}


// ------------------ LOAD HISTORY ------------------
function loadHistory() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users"));
  let transactions = users[user].transactions || [];

  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  transactions
    .slice()
    .reverse()
    .forEach((t) => {
      const li = document.createElement("li");
      li.classList.add(t.amount < 0 ? "minus" : "plus");
      li.textContent = `${t.text} : ₹${Math.abs(t.amount)}`;
      historyList.appendChild(li);
    });

  // compute monthly expense and balance (same logic as dashboard)
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = transactions
    .filter((t) => new Date(t.date).getMonth() === currentMonth && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const budget = users[user].budget || 0;
  const balance = budget - monthlyExpenses;

  document.getElementById("monthlyTotal").innerText = `Total: ₹${balance}`;
}

// ------------------ LOGOUT ------------------
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}



