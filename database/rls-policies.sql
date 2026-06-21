-- =========================================
-- Leave Management System
-- RLS Policies
-- =========================================

-- NOTE:
-- RLS is intentionally disabled on
-- leave_management_profiles.
--
-- During development, enabling RLS on
-- leave_management_profiles caused
-- policy recursion issues when checking
-- admin roles.
--
-- RLS remains enabled on
-- leave_management_requests.

-- =========================================
-- Enable RLS
-- =========================================

alter table public.leave_management_requests
enable row level security;

-- =========================================
-- Employee Policies
-- =========================================

-- Users can insert their own leave requests

create policy "Users can insert own leave"
on public.leave_management_requests
for insert
to authenticated
with check (
    auth.uid() = user_id
);

-- Users can view their own leave requests

create policy "Users can view own leaves"
on public.leave_management_requests
for select
to authenticated
using (
    auth.uid() = user_id
);

-- Users can delete only their own
-- pending leave requests

create policy "Users can delete own pending leaves"
on public.leave_management_requests
for delete
to authenticated
using (
    auth.uid() = user_id
    and status = 'pending'
);

-- =========================================
-- Admin Policies
-- =========================================

-- Admins can view all leave requests

create policy "Admins can view all leaves"
on public.leave_management_requests
for select
to authenticated
using (
    exists (
        select 1
        from leave_management_profiles p
        where p.id = auth.uid()
        and p.role = 'admin'
    )
);

-- Admins can update leave requests

create policy "Admins can update leaves"
on public.leave_management_requests
for update
to authenticated
using (
    exists (
        select 1
        from leave_management_profiles p
        where p.id = auth.uid()
        and p.role = 'admin'
    )
);

-- Admins can delete leave requests

create policy "Admins can delete leaves"
on public.leave_management_requests
for delete
to authenticated
using (
    exists (
        select 1
        from leave_management_profiles p
        where p.id = auth.uid()
        and p.role = 'admin'
    )
);