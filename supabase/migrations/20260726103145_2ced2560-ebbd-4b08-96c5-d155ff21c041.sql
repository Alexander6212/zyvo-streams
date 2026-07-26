
-- =========== ROLES ===========
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- =========== PROFILES ===========
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  status text not null default 'active',
  subscription_status text not null default 'none',
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins read all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- shared updated_at
create or replace function public.tg_set_updated_at() returns trigger language plpgsql set search_path=public as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.tg_set_updated_at();

-- signup handler: create profile + first user becomes admin
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare admin_exists boolean;
begin
  insert into public.profiles(id,email,full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;

  select exists(select 1 from public.user_roles where role='admin') into admin_exists;
  if not admin_exists then
    insert into public.user_roles(user_id, role) values (new.id,'admin') on conflict do nothing;
  else
    insert into public.user_roles(user_id, role) values (new.id,'user') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- backfill existing users
insert into public.profiles(id,email,full_name)
  select id, email, coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name')
  from auth.users on conflict (id) do nothing;

do $$
declare u record; admin_exists boolean;
begin
  select exists(select 1 from public.user_roles where role='admin') into admin_exists;
  for u in select id from auth.users order by created_at asc loop
    if not admin_exists then
      insert into public.user_roles(user_id,role) values (u.id,'admin') on conflict do nothing;
      admin_exists := true;
    else
      insert into public.user_roles(user_id,role) values (u.id,'user') on conflict do nothing;
    end if;
  end loop;
end $$;

-- =========== BLOG POSTS ===========
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  featured_image text,
  category text,
  tags text[] not null default '{}',
  author text,
  published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index blog_posts_published_idx on public.blog_posts(published, published_at desc);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "public read published posts" on public.blog_posts for select to anon, authenticated using (published = true);
create policy "admins read all posts" on public.blog_posts for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage posts" on public.blog_posts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger blog_posts_updated_at before update on public.blog_posts for each row execute function public.tg_set_updated_at();

-- =========== MOVIES ===========
create table public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  genre text,
  release_year int,
  rating numeric(3,1),
  poster_url text,
  featured boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.movies to anon, authenticated;
grant insert, update, delete on public.movies to authenticated;
grant all on public.movies to service_role;
alter table public.movies enable row level security;
create policy "public read enabled movies" on public.movies for select to anon, authenticated using (enabled = true);
create policy "admins read all movies" on public.movies for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage movies" on public.movies for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger movies_updated_at before update on public.movies for each row execute function public.tg_set_updated_at();

-- =========== CHANNELS ===========
create table public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  category text,
  country text,
  status text not null default 'active',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.channels to anon, authenticated;
grant insert, update, delete on public.channels to authenticated;
grant all on public.channels to service_role;
alter table public.channels enable row level security;
create policy "public read active channels" on public.channels for select to anon, authenticated using (status = 'active');
create policy "admins read all channels" on public.channels for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage channels" on public.channels for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger channels_updated_at before update on public.channels for each row execute function public.tg_set_updated_at();

-- =========== PRICING PLANS ===========
create table public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null,
  currency text not null default '£',
  period text not null,
  description text,
  features text[] not null default '{}',
  extra text,
  popular boolean not null default false,
  enabled boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pricing_plans to anon, authenticated;
grant insert, update, delete on public.pricing_plans to authenticated;
grant all on public.pricing_plans to service_role;
alter table public.pricing_plans enable row level security;
create policy "public read enabled plans" on public.pricing_plans for select to anon, authenticated using (enabled = true);
create policy "admins read all plans" on public.pricing_plans for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage plans" on public.pricing_plans for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger pricing_plans_updated_at before update on public.pricing_plans for each row execute function public.tg_set_updated_at();

insert into public.pricing_plans(name,price,period,features,extra,popular,display_order) values
('1 Month','9.99','month', ARRAY['7000+ Channels','40000+ VOD','HD / FHD / UHD*','UK / USA / IE / ASIAN','TV Guide (EPG)','ALL SPORTS AVAILABLE','24/7 Live Chat Support'],'5 for Extra Device', false, 1),
('3 Months','25','3 months', ARRAY['7000+ Channels','40000+ VOD','HD / FHD / UHD*','UK / USA / IE / ASIAN','TV Guide (EPG)','ALL SPORTS AVAILABLE','24/7 Live Chat Support'],'10 for Extra Device', false, 2),
('6 Months','40','6 months', ARRAY['7000+ Channels','40000+ VOD','HD / FHD / UHD*','UK / USA / IE / ASIAN','TV Guide (EPG)','ALL SPORTS AVAILABLE','24/7 Live Chat Support'],'20 for Extra Device', true, 3),
('1 Year','65','year', ARRAY['7000+ Channels','40000+ VOD','HD / FHD / UHD*','UK / USA / IE / ASIAN','TV Guide (EPG)','ALL SPORTS AVAILABLE','24/7 Live Chat Support'],'30 for Extra Device', false, 4);

-- =========== SUPPORT MESSAGES ===========
create table public.support_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'open',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.support_messages to anon, authenticated;
grant select, update, delete on public.support_messages to authenticated;
grant all on public.support_messages to service_role;
alter table public.support_messages enable row level security;
create policy "anyone can submit" on public.support_messages for insert to anon, authenticated with check (true);
create policy "admins read messages" on public.support_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins manage messages" on public.support_messages for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger support_messages_updated_at before update on public.support_messages for each row execute function public.tg_set_updated_at();

-- =========== SITE SETTINGS ===========
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.tg_set_updated_at();

insert into public.site_settings(key,value) values
('support_email', to_jsonb('jattbhutta321@gmail.com'::text)),
('announcement', to_jsonb(''::text)),
('site_title', to_jsonb('ZYVO IPTV — Premium Live TV & Entertainment'::text)),
('site_description', to_jsonb('Premium IPTV — 7000+ live TV channels, 40000+ VOD, HD/FHD/UHD on every device.'::text)),
('social_whatsapp', to_jsonb('https://wa.me/10000000000'::text)),
('social_telegram', to_jsonb('https://t.me/zyvoiptv'::text)),
('social_facebook', to_jsonb(''::text)),
('social_instagram', to_jsonb(''::text));
