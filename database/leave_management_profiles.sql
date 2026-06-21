create table public.leave_management_profiles (
  id uuid not null,
  name text not null,
  email text not null,
  role text not null default 'employee'::text,
  created_at timestamp with time zone null default now(),
  constraint leave_management_profiles_pkey primary key (id),
  constraint leave_management_profiles_email_key unique (email),
  constraint leave_management_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint leave_management_profiles_role_check check (
    (
      role = any (array['employee'::text, 'admin'::text])
    )
  )
) TABLESPACE pg_default;