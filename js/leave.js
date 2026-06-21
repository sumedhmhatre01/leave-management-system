const leaveForm = document.getElementById("leaveForm");

if (leaveForm) {
  leaveForm.addEventListener("submit", applyLeave);
}

// ======================
// Apply Leave
// ======================

async function applyLeave(event) {
  event.preventDefault();

  const userId = localStorage.getItem("user_id");

  const leaveType = document.getElementById("leaveType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const reason = document.getElementById("reason").value;

  const { error } = await supabaseClient
    .from("leave_management_requests")
    .insert([
      {
        user_id: userId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  showToast("Leave Applied Successfully", "success");

  leaveForm.reset();

  loadLeaves();
}

// ======================
// Load Leaves
// ======================

async function loadLeaves() {
  const userId = localStorage.getItem("user_id");

  const { data, error } = await supabaseClient
    .from("leave_management_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const leaveList = document.getElementById("leaveList");

  if (data.length === 0) {
    leaveList.innerHTML = "<p>No leave requests found.</p>";
    return;
  }

  leaveList.innerHTML = "";

  data.forEach((leave) => {
    let cancelButton = "";

    if (leave.status === "pending") {
      cancelButton = `
        <button onclick="cancelLeave(${leave.id})">
          Cancel Leave
        </button>
      `;
    }

    leaveList.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;">
        <p><strong>Type:</strong> ${leave.leave_type}</p>
        <p><strong>Start:</strong> ${leave.start_date}</p>
        <p><strong>End:</strong> ${leave.end_date}</p>
        <p>
  <strong>Status:</strong>
  <span class="status-badge ${leave.status}">
    ${leave.status}
  </span>
</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>

        ${cancelButton}
      </div>
    `;
  });
}

// ======================
// Cancel Leave
// ======================

async function cancelLeave(id) {
  const confirmDelete = await showConfirm(
    "Are you sure you want to cancel this leave?",
  );

  if (!confirmDelete) return;

  const { error } = await supabaseClient
    .from("leave_management_requests")
    .delete()
    .eq("id", id);

  if (error) {
    showToast(error.message, "error");
    return;
  }

  showToast("Leave Cancelled Successfully", "success");

  loadLeaves();
}

// ======================
// Initial Load
// ======================

loadLeaves();
