# ANNUR TEA — Supabase Setup & Deployment Guide

This document describes how to connect the ANNUR TEA platform to a live Supabase PostgreSQL project with full Row Level Security (RLS) and storage buckets.

---

## 1. Create a Supabase Project

1. Log in to [supabase.com](https://supabase.com) and create a new project named **annur-tea**.
2. Select your closest database region (e.g., Central Europe or East Asia).
3. Note your **Database Password**, **Project URL**, and **anon/public API key**.

---

## 2. Execute SQL Database Migrations

1. Go to the **SQL Editor** tab in your Supabase dashboard.
2. Open the file `src/supabase/schema.sql` from this codebase.
3. Paste its contents into the SQL Editor and click **Run**.
4. This script automatically provisions:
   - `profiles` (extends auth.users)
   - `user_roles` (RBAC: buyer, seller, admin)
   - `seller_profiles`
   - `categories`
   - `products` (with retail & wholesale tiers)
   - `carts` & `cart_items`
   - `addresses`
   - `orders` & `order_items` (with seller attribution)
   - `wholesale_requests`
   - `favorites`
   - `reviews`
   - `contact_messages`
   - `audit_logs`
   - `site_settings`
   - Row Level Security (RLS) policies and `is_admin()` helper function.

---

## 3. Storage Buckets

In the **Storage** section of your Supabase dashboard:
1. Create a public bucket: `product-images` (for public catalog photos).
2. Create a private bucket: `seller-documents` (for seller business licenses and certificates).

---

## 4. Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

---

## 5. Security Architecture

- **Client vs Server Key Boundary**: Never expose the `service_role` key in frontend environment variables. All client operations run through the public `VITE_SUPABASE_ANON_KEY` governed strictly by PostgreSQL Row Level Security.
- **Admin Assignment**: Admins must be provisioned directly via Supabase SQL:
  ```sql
  INSERT INTO public.user_roles (user_id, role)
  VALUES ('<USER_UUID_FROM_AUTH_USERS>', 'admin')
  ON CONFLICT DO NOTHING;
  ```
