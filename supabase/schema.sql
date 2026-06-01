create extension if not exists "pgcrypto";

create type deal_status as enum ('pending', 'approved', 'rejected');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  total_points integer not null default 0,
  withdrawable_points integer not null default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  original_price integer not null check (original_price >= 0),
  sale_price integer not null check (sale_price >= 0),
  discount_amount integer generated always as (greatest(original_price - sale_price, 0)) stored,
  discount_rate integer generated always as (
    case
      when original_price > 0 then floor(((greatest(original_price - sale_price, 0))::numeric / original_price) * 100)
      else 0
    end
  ) stored,
  product_url text not null unique,
  image_path text,
  description text not null,
  mall text not null,
  status deal_status not null default 'pending',
  is_top boolean not null default false,
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  constraint deal_discount_rule check (
    (original_price > 0 and floor(((greatest(original_price - sale_price, 0))::numeric / original_price) * 100) >= 50)
    or greatest(original_price - sale_price, 0) >= 100000
  )
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (deal_id, user_id)
);

create table public.points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  deal_id uuid references public.deals(id) on delete set null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index deals_status_created_at_idx on public.deals(status, created_at desc);
create index deals_is_top_idx on public.deals(is_top) where is_top = true;
create index votes_deal_id_idx on public.votes(deal_id);
create index points_user_id_idx on public.points(user_id);

create or replace function public.prevent_daily_deal_limit()
returns trigger
language plpgsql
as $$
begin
  if (
    select count(*)
    from public.deals
    where user_id = new.user_id
      and created_at >= date_trunc('day', now())
  ) >= 3 then
    raise exception 'daily deal submit limit exceeded';
  end if;

  return new;
end;
$$;

create trigger deals_daily_limit
before insert on public.deals
for each row execute function public.prevent_daily_deal_limit();

create or replace function public.award_points_on_approval()
returns trigger
language plpgsql
as $$
begin
  if old.status <> 'approved' and new.status = 'approved' then
    insert into public.points (user_id, deal_id, amount, reason)
    values (new.user_id, new.id, 100, 'deal_approved');

    update public.users
    set total_points = total_points + 100,
        withdrawable_points = withdrawable_points + 100
    where id = new.user_id;
  end if;

  return new;
end;
$$;

create trigger deals_award_points
after update of status on public.deals
for each row execute function public.award_points_on_approval();

alter table public.users enable row level security;
alter table public.deals enable row level security;
alter table public.votes enable row level security;
alter table public.points enable row level security;

create policy "Users can read their own profile"
on public.users for select
using (auth.uid() = id);

create policy "Approved deals are public"
on public.deals for select
using (status = 'approved' or auth.uid() = user_id);

create policy "Authenticated users can submit deals"
on public.deals for insert
with check (auth.uid() = user_id);

create policy "Users can vote once"
on public.votes for insert
with check (auth.uid() = user_id);

create policy "Users can read their points"
on public.points for select
using (auth.uid() = user_id);
