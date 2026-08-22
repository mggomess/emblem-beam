update auth.users
set encrypted_password = crypt('M@rc3190', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
where email = 'admin@admin.local';