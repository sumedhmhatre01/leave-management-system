// Route Protection

const userId = localStorage.getItem("user_id");
const userRole = localStorage.getItem("user_role");

if (!userId) {
  window.location.href = "login.html";
}

if (userRole !== "admin") {
  window.location.href = "login.html";
}

console.log("admin.js loaded");

// Welcome Message

const adminName = document.getElementById("adminName");

adminName.textContent = `Welcome, ${localStorage.getItem("user_name")}`;

// Elements

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");
const leaveContainer = document.getElementById("leaveContainer");

// Logout

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logout);

async function logout() {
  await supabaseClient.auth.signOut();

  localStorage.clear();

  window.location.href = "login.html";
}

// Load Leaves

async function loadLeaves() {
  const { data, error } = await supabaseClient
    .from("leave_management_requests")
    .select(
      `
      *,
      leave_management_profiles (
        name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  displayLeaves(data);
}

// Display Leaves

function displayLeaves(leaves) {
  leaveContainer.innerHTML = "";

  if (leaves.length === 0) {
    leaveContainer.innerHTML = "<p>No leave requests found.</p>";
    return;
  }

  leaves.forEach((leave) => {
    leaveContainer.innerHTML += `
      <div
        style="
          border:1px solid #ccc;
          padding:10px;
          margin-bottom:10px;
        "
      >

        <p>
          <strong>Name:</strong>
          ${leave.leave_management_profiles?.name || "N/A"}
        </p>

        <p>
          <strong>Email:</strong>
          ${leave.leave_management_profiles?.email || "N/A"}
        </p>

        <p>
          <strong>Leave Type:</strong>
          ${leave.leave_type}
        </p>

        <p>
          <strong>Start Date:</strong>
          ${leave.start_date}
        </p>

        <p>
          <strong>End Date:</strong>
          ${leave.end_date}
        </p>

        <p>
  <strong>Status:</strong>
  <span class="status-badge ${leave.status}">
    ${leave.status}
  </span>
</p>

        <p>
          <strong>Reason:</strong>
          ${leave.reason}
        </p>

        <button onclick="approveLeave(${leave.id})">
          Approve
        </button>

        <button onclick="rejectLeave(${leave.id})">
          Reject
        </button>

        <button onclick="deleteLeave(${leave.id})">
          Delete
        </button>

      </div>
    `;
  });
}

// Search

searchBtn.addEventListener("click", async () => {
  const searchValue = searchInput.value.trim().toLowerCase();

  const { data, error } = await supabaseClient.from("leave_management_requests")
    .select(`
      *,
      leave_management_profiles (
        name,
        email
      )
    `);

  if (error) {
    console.error(error);
    return;
  }

  const filtered = data.filter((leave) =>
    leave.leave_management_profiles?.email?.toLowerCase().includes(searchValue),
  );

  displayLeaves(filtered);
});

// Status Filter

statusFilter.addEventListener("change", async () => {
  const status = statusFilter.value;

  let query = supabaseClient.from("leave_management_requests").select(`
      *,
      leave_management_profiles (
        name,
        email
      )
    `);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  displayLeaves(data);
});

// Leave Type Filter

typeFilter.addEventListener("change", async () => {
  const type = typeFilter.value;

  let query = supabaseClient.from("leave_management_requests").select(`
      *,
      leave_management_profiles (
        name,
        email
      )
    `);

  if (type) {
    query = query.eq("leave_type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  displayLeaves(data);
});

// Approve

async function approveLeave(id) {
  const { error } = await supabaseClient
    .from("leave_management_requests")
    .update({
      status: "approved",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadLeaves();
}

// Reject

async function rejectLeave(id) {
  const { error } = await supabaseClient
    .from("leave_management_requests")
    .update({
      status: "rejected",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadLeaves();
}

// Delete

async function deleteLeave(id) {
  const confirmDelete = await showConfirm("Delete this leave request?");

  if (!confirmDelete) return;

  const { error } = await supabaseClient
    .from("leave_management_requests")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadLeaves();
}

// Initial Load

loadLeaves();
