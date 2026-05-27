/* ============================================
   GUEST MAP - Bản đồ tên khách mời
   -------------------------------------------
   🔧 Thêm/sửa khách mời tại đây.
   Key: query param "?guest=xxx"
   Value: Tên hiển thị trên thiệp
   ============================================ */

export const GUEST_MAP: Record<string, string> = {
  tung: "Anh Tùng",
  duy: "Anh Duy",
  phuong: "Chị Phương",
  truong: "Anh Trường",
  son: "Anh Sơn",
  hien: "Chị Hiền",
  // ➕ Thêm khách mời mới theo format: key: "Tên hiển thị"
};

/** Tên mặc định khi không có query hoặc không khớp */
export const DEFAULT_GUEST_NAME = "Bạn";

/**
 * Lấy tên khách mời từ key
 * @param key - Query param "guest" từ URL
 * @returns Tên khách mời hoặc tên mặc định
 */
export function getGuestName(key: string | null | undefined): string {
  if (!key) return DEFAULT_GUEST_NAME;
  return GUEST_MAP[key.toLowerCase()] ?? DEFAULT_GUEST_NAME;
}
