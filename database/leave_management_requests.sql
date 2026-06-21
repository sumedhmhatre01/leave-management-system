create table public.leave_management_requests (
  id bigint generated always as identity not null,
  user_id uuid not null,
  leave_type text not null,
  start_date date not null,
  end_date date not null,
  reason text null,
  status text not null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  constraint leave_management_requests_pkey primary key (id),
  constraint leave_management_requests_user_id_fkey foreign KEY (user_id) references leave_management_profiles (id) on delete CASCADE,
  constraint leave_management_requests_leave_type_check check (
    (
      leave_type = any (
        array[
          'Casual'::text,
          'Sick'::text,
          'Annual'::text,
          'WFH'::text
        ]
      )
    )
  ),
  constraint leave_management_requests_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'approved'::text,
          'rejected'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;