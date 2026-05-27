# 🎓 Hướng Dẫn Thiết Lập & Deploy — Thiệp Mời Lễ Tốt Nghiệp

> **Nguyễn Duy Hưng** — Đại học Công nghệ Thông tin (UIT)  
> Tech Stack: Next.js · React · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase · Vercel

---

## 📁 Cấu trúc thư mục

```
invitation/
├── app/
│   ├── layout.tsx          # Root layout, SEO metadata
│   ├── page.tsx            # Trang thiệp mời chính
│   ├── globals.css         # Design system & CSS tokens
│   └── admin/
│       └── page.tsx        # Dashboard quản lý RSVP
├── components/
│   ├── ParticleBackground.tsx  # Hiệu ứng hạt sáng nền
│   ├── Fireworks.tsx           # Hiệu ứng pháo hoa
│   ├── Countdown.tsx           # Đồng hồ đếm ngược
│   ├── RSVPForm.tsx            # Form xác nhận tham gia
│   └── Toast.tsx               # Thông báo pop-up
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── guests.ts           # Bản đồ tên khách mời
├── env.local.example       # Template biến môi trường
├── package.json
├── tailwind.config.ts      # (Không cần - Tailwind v4 CSS-first)
└── HUONG_DAN.md            # 👈 File này
```

---

## 1️⃣ Cài đặt & Chạy Local

### Bước 1: Cài đặt dependencies

```bash
# Clone hoặc mở thư mục dự án
cd invitation

# Cài đặt packages (đã cài sẵn nếu bạn dùng agent)
npm install
```

### Bước 2: Cấu hình biến môi trường

```bash
# Tạo file .env.local từ template
cp env.local.example .env.local
```

Mở file `.env.local` và điền thông tin Supabase (xem phần 2 bên dưới).

### Bước 3: Chạy dev server

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

Thử với tên khách mời: **http://localhost:3000/?guest=tung**

---

## 2️⃣ Thiết lập Supabase (Database miễn phí)

### Bước 1: Tạo tài khoản & Project

1. Truy cập [https://supabase.com](https://supabase.com) → **Start your project** (đăng nhập bằng GitHub)
2. Click **New Project**
3. Điền thông tin:
   - **Name**: `graduation-invitation` (hoặc tên bất kỳ)
   - **Database Password**: tạo mật khẩu mạnh (lưu lại)
   - **Region**: `Southeast Asia (Singapore)` — gần Việt Nam nhất
4. Click **Create new project** → đợi 1-2 phút

### Bước 2: Tạo bảng RSVP

1. Trong Dashboard, click **SQL Editor** (thanh bên trái)
2. Click **New query**
3. **Dán đoạn SQL sau** và nhấn **Run**:

```sql
-- ============================================
-- TẠO BẢNG LƯU TRỮ RSVP
-- ============================================

CREATE TABLE rsvp (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT,
  attending BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (bảo mật)
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người INSERT (gửi RSVP) 
CREATE POLICY "Cho phép gửi RSVP"
  ON rsvp
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Cho phép đọc dữ liệu (cho trang admin)
CREATE POLICY "Cho phép đọc RSVP"
  ON rsvp
  FOR SELECT
  TO anon
  USING (true);
```

> ✅ Sau khi chạy, bạn sẽ thấy bảng `rsvp` trong mục **Table Editor**.

### Bước 3: Lấy URL & API Key

1. Vào **Project Settings** (icon bánh răng ⚙️) → **API**
2. Copy hai giá trị sau:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOi...` (chuỗi dài)
3. Dán vào file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> ⚠️ **Lưu ý**: `anon key` là key công khai, an toàn để dùng ở client. KHÔNG bao giờ dùng `service_role key` ở frontend.

---

## 3️⃣ Deploy lên Vercel (Miễn phí)

### Bước 1: Đẩy code lên GitHub

```bash
# Tại thư mục dự án
cd invitation

# Khởi tạo Git (nếu chưa có)
git init

# Thêm tất cả file
git add .

# Commit
git commit -m "🎓 Thiệp mời Lễ Tốt Nghiệp - Nguyễn Duy Hưng"

# Tạo repo mới trên GitHub (https://github.com/new)
# Tên repo: graduation-invitation

# Kết nối và đẩy lên
git remote add origin https://github.com/YOUR_USERNAME/graduation-invitation.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy trên Vercel

1. Truy cập [https://vercel.com](https://vercel.com) → **Sign up** bằng GitHub
2. Click **Add New...** → **Project**
3. Chọn repo `graduation-invitation` → **Import**
4. Trong phần **Environment Variables**, thêm:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
5. Click **Deploy** → đợi 1-2 phút
6. 🎉 Website của bạn đã live tại: `https://your-project.vercel.app`

### Bước 3: Chia sẻ thiệp mời

Gửi link cá nhân hóa cho từng người:

| Khách mời | Link |
|-----------|------|
| Anh Tùng | `https://your-domain.vercel.app/?guest=tung` |
| Anh Duy | `https://your-domain.vercel.app/?guest=duy` |
| Chị Phương | `https://your-domain.vercel.app/?guest=phuong` |
| Anh Trường | `https://your-domain.vercel.app/?guest=truong` |
| Anh Sơn | `https://your-domain.vercel.app/?guest=son` |
| Chị Hiền | `https://your-domain.vercel.app/?guest=hien` |
| Mặc định | `https://your-domain.vercel.app/` → hiển thị "Bạn" |

---

## 4️⃣ Tùy chỉnh

### Thêm khách mời mới

Mở file `lib/guests.ts` và thêm vào object `GUEST_MAP`:

```typescript
export const GUEST_MAP: Record<string, string> = {
  tung: "Anh Tùng",
  duy: "Anh Duy",
  // ➕ Thêm ở đây:
  minh: "Anh Minh",
  lan: "Chị Lan",
};
```

### Đổi mật khẩu Admin

Mở file `app/admin/page.tsx`, tìm dòng:

```typescript
const ADMIN_PASSWORD = "2026";
```

Thay bằng mật khẩu mong muốn.

### Thay đổi ngày Lễ Tốt Nghiệp

Mở file `components/Countdown.tsx`, tìm dòng:

```typescript
const TARGET_DATE = new Date("2026-06-10T08:00:00+07:00");
```

### Thay đổi nội dung thiệp

Tất cả nội dung text nằm trong `app/page.tsx`. Tìm các section:
- **Thông tin chính**: Tên, trường, ngành
- **Thời gian & Địa điểm**: Ngày giờ, địa chỉ
- **Lời tâm sự**: Đoạn văn cảm ơn

### Thay đổi bảng màu

Mở `app/globals.css`, chỉnh biến CSS trong `:root`:

```css
:root {
  --blue-500: #2563eb;    /* Màu xanh chủ đạo */
  --gold-400: #fbbf24;    /* Màu vàng accent */
  --bg-primary: #0a0e1a;  /* Màu nền */
}
```

---

## 5️⃣ Truy cập trang Admin

1. Vào: `https://your-domain.vercel.app/admin`
2. Nhập mật khẩu: `2026`
3. Xem danh sách khách mời đã phản hồi, thống kê tham gia/không tham gia

---

## 💡 Mẹo

- **Custom Domain**: Trong Vercel Dashboard → Settings → Domains → thêm domain riêng (nếu có)
- **Auto Deploy**: Mỗi khi push code mới lên GitHub, Vercel sẽ tự động deploy lại
- **Analytics**: Bật Vercel Analytics miễn phí trong Dashboard để xem số người truy cập

---

> 🎓 Chúc mừng Hưng tốt nghiệp! Chúc buổi lễ thật trọn vẹn! 🎉
