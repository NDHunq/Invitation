# Huong Dan Tich Hop Database Va Deploy Mien Phi

Tai lieu nay huong dan chi tiet cho project invitation (Next.js App Router) theo 2 huong:
- Huong A: Supabase (de nhanh va it sua code nhat)
- Huong B: Neon Postgres (khi khong dung Supabase free)

Dong thoi co quy trinh deploy mien phi len Vercel sau khi hoan tat.

## 1) Tong quan kien truc hien tai cua project

Project hien tai dang su dung:
- Client Supabase trong file `lib/supabase.ts`
- Form RSVP ghi du lieu vao bang `rsvps`
- Wishes Wall doc du lieu tu bang `rsvps` va nghe realtime `INSERT`

Vi vay, neu dung Supabase thi gan nhu khong can doi code business logic.

## 2) Huong A - Tich hop Supabase (khuyen nghi)

### 2.1 Tao project Supabase

1. Truy cap https://supabase.com
2. Tao project moi
3. Chon region gan nguoi dung nhat (vi du Southeast Asia)
4. Ghi lai thong tin:
- Project URL
- anon public key

### 2.2 Tao bang `rsvps`

Vao SQL Editor trong Supabase, chay script sau:

```sql
create table if not exists public.rsvps (
  id bigint generated always as identity primary key,
  name text not null,
  message text,
  attending boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
```

### 2.3 Bat RLS va tao policy

Vi app dang goi truc tiep tu client bang anon key, can policy de:
- ai cung co the insert RSVP
- ai cung co the xem danh sach loi chuc

Chay SQL:

```sql
alter table public.rsvps enable row level security;

drop policy if exists "Allow public insert rsvps" on public.rsvps;
create policy "Allow public insert rsvps"
on public.rsvps
for insert
to anon
with check (true);

drop policy if exists "Allow public select rsvps" on public.rsvps;
create policy "Allow public select rsvps"
on public.rsvps
for select
to anon
using (true);
```

Luu y:
- Mot so version Postgres/Supabase khong ho tro `create policy if not exists`, vi vay dung cap `drop policy if exists` + `create policy` de tuong thich cao nhat.

Goi y bao mat:
- Neu sau nay muon admin-only xem du lieu day du, hay tach policy theo role.
- Co the them captcha/rate-limit de tranh spam.

### 2.4 Bat Realtime cho bang `rsvps`

Muc tieu cua buoc nay: dua bang `public.rsvps` vao publication `supabase_realtime`.

Lam theo 1 trong 2 cach ben duoi (tuy giao dien Supabase ban dang thay):

Cach A (qua Replication):
1. Vao Dashboard project Supabase.
2. Chon Database o menu ben trai.
3. Chon Replication.
4. Tim publication ten `supabase_realtime`.
5. Bam vao publication do.
6. Bam Add tables (hoac Edit tables).
7. Tick bang `public.rsvps`.
8. Save.

Cach B (qua Table Editor):
1. Vao Table Editor.
2. Mo bang `rsvps`.
3. Tim tab hoac panel Realtime.
4. Bat toggle Enable realtime cho bang nay.
5. Save neu he thong yeu cau.

Neu UI cua ban khac hoan toan, dung SQL fallback sau trong SQL Editor:

```sql
alter publication supabase_realtime add table public.rsvps;
```

Neu bao bang da ton tai trong publication, bo qua loi do (khong sao).

Kiem tra da bat thanh cong chua:

```sql
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by schemaname, tablename;
```

Ket qua can co dong:
- schemaname = public
- tablename = rsvps

Test nhanh realtime trong app:
1. Mo 2 tab cung mot link web.
2. Tab A gui mot loi chuc moi.
3. Tab B dang mo section So luu but.
4. Neu thanh cong, tab B se tu cap nhat ma khong can reload.

Luu y:
- App dang nghe su kien INSERT, nen chi can bat realtime cho bang `rsvps`.
- Neu khong thay update, thu refresh 1 lan roi test lai 2 tab.

### 2.5 Cau hinh bien moi truong local

1. Copy file mau:

```bash
cp env.local.example .env.local
```

2. Dien thong tin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 2.6 Chay local va test

```bash
npm install
npm run dev
```

Checklist test:
- Mo trang chu
- Gui RSVP thanh cong
- Mo section So luu but, thay loi chuc hien ra
- Thu mo 2 tab, gui 1 tab va quan sat tab kia co update realtime

### 2.7 Loi thuong gap

1. Insert loi policy:
- Kiem tra RLS policy insert cho role `anon`.

2. Khong thay du lieu:
- Kiem tra policy select cho role `anon`.
- Kiem tra query dang dung dung ten bang `rsvps`.

3. Khong realtime:
- Kiem tra bang `rsvps` da bat replication/realtime.

4. Dang xem mock thay vi du lieu that:
- Kiem tra env da set dung URL/key.

## 3) Huong B - Dung Neon Postgres thay Supabase

Neon la Postgres managed service. Khac biet quan trong:
- Neon khong cung cap API client giong Supabase cho browser.
- Nen tuong tac DB qua server (Route Handlers hoac Server Actions), khong goi truc tiep tu client.

### 3.1 Tao DB tren Neon

1. Vao https://neon.tech
2. Tao project
3. Lay `DATABASE_URL` (pooled connection)
4. Tao bang `rsvps` bang SQL y nhu muc 2.2 (tren Neon SQL editor)

### 3.2 Cau hinh env

Them vao `.env.local`:

```env
DATABASE_URL=postgresql://...
```

### 3.3 Tao DB client phia server

Cai package:

```bash
npm install postgres
```

Tao file `lib/db.ts`:

```ts
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});
```

### 3.4 Tao API route cho RSVP

Vi du `app/api/rsvps/route.ts`:

```ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`
    select id, name, message, attending, created_at
    from rsvps
    where message is not null and message <> ''
    order by created_at desc
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, message, attending } = body;

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [row] = await sql`
    insert into rsvps (name, message, attending)
    values (
      ${String(name).trim()},
      ${String(message || "").trim() || null},
      ${Boolean(attending)}
    )
    returning id, name, message, attending, created_at
  `;

  return NextResponse.json(row, { status: 201 });
}
```

### 3.5 Dieu chinh frontend khi dung Neon

Can doi cac diem dang goi `supabase.from(...)` sang goi API:
- POST `/api/rsvps` khi submit RSVP
- GET `/api/rsvps` de hien thi wishes

Realtime voi Neon (mien phi, nhanh):
- Cach don gian: polling 10-20 giay
- Cach nang cao: WebSocket/SSE + trigger notify

Khuyen nghi thuc te:
- Neu can realtime san va code gon, tiep tuc Supabase.
- Neu uu tien Postgres thuần va linh hoat, dung Neon + API server.

## 4) Deploy mien phi

## 4.1 Lua chon de xuat

1. De nhanh va it cong nhat:
- Vercel (host Next.js)
- Supabase free (database + realtime)

2. Phuong an thay the:
- Vercel (host Next.js)
- Neon free (Postgres)

## 4.2 Truoc khi deploy

Chay local:

```bash
npm run dev
```

Kiem tra:
- Route `/` hoat dong
- Route `/wishes` hoat dong
- Submit RSVP thanh cong
- Wishes hien thi dung

Neu muon kiem tra build:

```bash
npm run build
npm run start
```

## 4.3 Deploy Vercel tung buoc

1. Push code len GitHub
2. Vao https://vercel.com -> New Project
3. Import repo
4. Framework preset: Next.js
5. Them Environment Variables:

Neu dung Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Neu dung Neon + API route:
- `DATABASE_URL`

6. Bam Deploy

Sau deploy:
- Mo domain Vercel
- Test submit RSVP
- Test route `/wishes`

## 4.4 Mapping domain free

Ban co the dung luon subdomain mien phi cua Vercel:
- `your-project.vercel.app`

Neu co domain rieng, them trong Vercel Settings -> Domains.

## 5) Bao mat va van hanh co ban

1. Khong commit `.env.local` len git.
2. Khong dung service role key o client.
3. Them rate-limit/captcha neu app public de tranh spam form.
4. Backup du lieu dinh ky:
- Supabase: dung backup/export SQL
- Neon: branch + dump

## 6) Chi phi free tier can luu y

Supabase free:
- Gioi han database size, bandwidth, realtime, inactivity pause.

Neon free:
- Gioi han compute hours/storage.

Vercel free:
- Gioi han build minutes, function execution, bandwidth.

Khuyen nghi:
- Bat logging
- Theo doi usage sau khi gui thiep rong rai

## 7) Ke hoach migrate Supabase -> Neon (neu can)

1. Export schema + data tu Supabase
2. Import vao Neon
3. Chuyen code tu supabase client sang API server
4. Retest RSVP + wishes + route `/wishes`
5. Cap nhat env tren Vercel
6. Redeploy

---

Neu ban muon, buoc tiep theo minh co the viet san:
- bo file API route cho Neon
- patch code frontend de switch Supabase/Neon bang env flag
- them rate-limit co ban cho endpoint RSVP
