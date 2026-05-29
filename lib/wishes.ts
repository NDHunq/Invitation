export interface WishItem {
  id: number;
  name: string | null;
  message: string | null;
  created_at: string;
}

export function getMockWishes(): WishItem[] {
  const now = Date.now();

  return [
    {
      id: 1001,
      name: "Anh Tùng",
      message:
        "Chúc mừng em đã hoàn thành một hành trình rất đáng tự hào. Chúc em luôn giữ lửa với nghề và bứt phá ở chặng đường mới!",
      created_at: new Date(now - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 1002,
      name: "Chị Phương",
      message:
        "Tự hào về em rất nhiều. Chúc em vững vàng, gặp nhiều mentor tốt và luôn hạnh phúc với những gì mình chọn.",
      created_at: new Date(now - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 1003,
      name: "Anh Trường",
      message:
        "Một cột mốc đẹp! Chúc em sớm có dự án xịn, team vui và thu nhập tăng đều mỗi năm.",
      created_at: new Date(now - 1000 * 60 * 90).toISOString(),
    },
    {
      id: 1004,
      name: "Chị Hiền",
      message:
        "Nhìn em trưởng thành qua từng năm thật vui. Chúc em luôn bình an, kiên định và giữ được tinh thần học hỏi.",
      created_at: new Date(now - 1000 * 60 * 150).toISOString(),
    },
    {
      id: 1005,
      name: "Anh Sơn",
      message:
        "Congrats em! Chúc em code ít bug, deploy phát ăn ngay và sớm chạm những mục tiêu lớn phía trước.",
      created_at: new Date(now - 1000 * 60 * 220).toISOString(),
    },
    {
      id: 1006,
      name: "Bạn Minh",
      message:
        "Một khởi đầu mới thật rực rỡ nhé. Chúc mừng tốt nghiệp và hẹn gặp em ở những cột mốc tuyệt vời hơn nữa!",
      created_at: new Date(now - 1000 * 60 * 300).toISOString(),
    },
    {
      id: 1007,
      name: "Bạn Duy",
      message:
        "Từ đồ án đến deadline đều đã vượt qua xuất sắc. Chúc ông bạn thành công và luôn có nhiều năng lượng tích cực.",
      created_at: new Date(now - 1000 * 60 * 360).toISOString(),
    },
    {
      id: 1008,
      name: "Chị Lan",
      message:
        "Chúc em thật nhiều may mắn trong công việc và cuộc sống. Hãy cứ tự tin vì em đã làm rất tốt rồi.",
      created_at: new Date(now - 1000 * 60 * 500).toISOString(),
    },
  ];
}

export function normalizeWishes(items: WishItem[]): WishItem[] {
  // Keep all items (including those without a message) but sort by newest first.
  return items
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
