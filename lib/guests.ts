/* ============================================
   GUEST MAP - Bản đồ tên khách mời
   -------------------------------------------
   🔧 Thêm/sửa khách mời tại đây.
   Key: query param "?guest=xxx"
   Value: Tên hiển thị trên thiệp
   ============================================ */

export const GUEST_MAP: Record<string, string> = {
  quang: "Bạn Quang",
  bao: "Bạn Bảo",
  tan: "Bạn Tân",
  tran: "Bạn Trân",
  tien: "Bạn Tiên",
  thu: "Bạn Thư",
  "ban-hien": "Bạn Hiển",
  phuc: "Bạn Phúc",
  huy: "Bạn Huy",
  "dai-gia-dinh": "Đại gia đình",
  "chi-hai-uyen-va-be-tue": "Chị Hai Uyên và bé Tuệ",
  "anh-tan": "Anh Tân",
  "anh-man": "Anh Mẫn",
  "chi-thanh": "Chị Thanh",
  "anh-son": "Anh Sơn",
  "chi-phuong-va-anh-nhut": "Chị Phương và anh Nhựt",
  // ➕ Thêm khách mời mới theo format: key: "Tên hiển thị"
  "anh-duy": "Anh Duy",
  "anh-hoang": "Anh Hoàng",
  "anh-nhat": "Anh Nhất",
  "chi-phien": "Chị Phiến",
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
