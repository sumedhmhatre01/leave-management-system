console.log("auth.js loaded");

// ======================
// Signup
// ======================

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", signup);
}

async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  const { error: profileError } = await supabaseClient
    .from("leave_management_profiles")
    .insert([
      {
        id: user.id,
        name,
        email,
        role: "employee",
      },
    ]);

  if (profileError) {
    alert(profileError.message);
    return;
  }

  alert("Signup Successful");
  window.location.href = "login.html";
}

// ======================
// Login
// ======================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", login);
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabaseClient
    .from("leave_management_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) {
    alert(profileError.message);
    return;
  }

  // Store user data for later use
  localStorage.setItem("user_id", userId);
  localStorage.setItem("user_name", profile.name);
  localStorage.setItem("user_role", profile.role);

  if (profile.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "dashboard.html";
  }
}
