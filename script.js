function signup() {
  const user = document.getElementById('signupUser').value.trim();
  const pass = document.getElementById('signupPass').value.trim();

  if (!user || !pass) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[user]) {
    alert("Username already exists!");
    return;
  }

  users[user] = { password: pass, transactions: [] };
  localStorage.setItem('users', JSON.stringify(users));
  alert("Signup successful! Please login now.");
}

function login() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[user] && users[user].password === pass) {
    localStorage.setItem('currentUser', user);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = "index.html";
}

