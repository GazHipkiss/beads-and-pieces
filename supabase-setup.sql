-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

-- Products table
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric not null,
  description text,
  category text not null,
  stock integer default 0,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_number bigint generated always as identity,
  stripe_session_id text,
  paypal_order_id text,
  payment_method text default 'stripe' check (payment_method in ('stripe', 'paypal')),
  customer_email text,
  customer_name text,
  shipping_address jsonb,
  items jsonb not null,
  subtotal numeric,
  shipping numeric,
  total numeric,
  status text default 'pending' check (status in ('pending', 'fulfilled', 'cancelled')),
  created_at timestamptz default now()
);

-- Enable Row Level Security (required by Supabase)
alter table products enable row level security;
alter table orders enable row level security;

-- Allow service role full access (your server-side code uses the service role key)
create policy "Service role full access on products"
  on products for all
  using (true)
  with check (true);

create policy "Service role full access on orders"
  on orders for all
  using (true)
  with check (true);

-- If you already created the orders table without the PayPal columns, run these:
-- alter table orders add column if not exists paypal_order_id text;
-- alter table orders add column if not exists payment_method text default 'stripe';

-- Optional: seed with your starter products
-- Uncomment and edit these if you want to populate from SQL:
--
-- insert into products (name, price, description, category, stock, image_url) values
--   ('Gold Beaded Bracelet', 29.99, 'A beautifully handcrafted gold beaded bracelet.', 'bracelets', 10, null),
--   ('Pearl Drop Earrings', 34.99, 'Elegant pearl drop earrings for any occasion.', 'earrings', 10, null),
--   ('Crystal Pendant Necklace', 39.99, 'A stunning crystal pendant on a delicate chain.', 'necklaces', 10, null),
--   ('Rose Quartz Bracelet', 24.99, 'A calming rose quartz bracelet with natural stones.', 'bracelets', 10, null),
--   ('Silver Hoop Earrings', 19.99, 'Classic silver hoop earrings with a modern twist.', 'earrings', 10, null),
--   ('Gold Layered Necklace', 44.99, 'A luxurious layered gold necklace.', 'necklaces', 10, null);
