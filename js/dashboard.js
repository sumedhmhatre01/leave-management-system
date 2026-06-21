// Route Protection

const userId = localStorage.getItem("user_id");
const userRole = localStorage.getItem("user_role");

if (!userId) {
  window.location.href = "login.html";
}

if (userRole !== "employee") {
  window.location.href = "login.html";
}

console.log("dashboard.js loaded");

const welcomeMessage = document.getElementById("welcomeMessage");

const userName = localStorage.getItem("user_name");

welcomeMessage.textContent = `Welcome, ${userName}`;

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logout);

async function logout() {
  await supabaseClient.auth.signOut();

  localStorage.clear();

  window.location.href = "login.html";
}
