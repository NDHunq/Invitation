"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

/* ============================================
   ADMIN DASHBOARD
   -------------------------------------------
   Route: /admin
   Bảo vệ bằng mật khẩu cứng.
   Hiển thị danh sách RSVP từ Supabase.
   
   🔧 Thay đổi mật khẩu tại ADMIN_PASSWORD
   ============================================ */

// ⚠️ Mật khẩu admin - Thay đổi tại đây
const ADMIN_PASSWORD = "2026";

interface RSVPRecord {
  id: number;
  name: string;
  message: string | null;
  attending: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RSVPRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<RSVPRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editAttending, setEditAttending] = useState(true);
  const [editMessage, setEditMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  /** Kiểm tra mật khẩu */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Mật khẩu không đúng!");
    }
  };

  /** Lấy danh sách RSVP từ Supabase */
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu RSVP", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(`Không tải được dữ liệu RSVP: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const openEditModal = (record: RSVPRecord) => {
    setEditingRecord(record);
    setEditName(record.name);
    setEditAttending(record.attending);
    setEditMessage(record.message ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    if (!editName.trim()) {
      setError("Tên khách mời không được để trống.");
      return;
    }

    setError("");
    setActionLoadingId(editingRecord.id);

    try {
      const payload = {
        name: editName.trim(),
        attending: editAttending,
        message: editMessage.trim() || null,
      };

      const { data, error } = await supabase
        .from("rsvps")
        .update(payload)
        .eq("id", editingRecord.id)
        .select("*")
        .single();

      if (error) throw error;

      setRecords((current) =>
        current.map((record) => (record.id === editingRecord.id ? (data as RSVPRecord) : record))
      );
      setEditingRecord(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(`Không sửa được phản hồi: ${message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (record: RSVPRecord) => {
    if (!window.confirm(`Xóa phản hồi của ${record.name}?`)) return;

    setError("");
    setActionLoadingId(record.id);

    try {
      const { error } = await supabase.from("rsvps").delete().eq("id", record.id);
      if (error) throw error;

      setRecords((current) => current.filter((item) => item.id !== record.id));
      if (selectedRecord?.id === record.id) setSelectedRecord(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(`Không xóa được phản hồi: ${message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    if (authenticated) fetchRecords();
  }, [authenticated, fetchRecords]);

  // Thống kê
  const totalAttending = records.filter((r) => r.attending).length;
  const totalDeclined = records.filter((r) => !r.attending).length;

  /* ============================================
     GIAO DIỆN ĐĂNG NHẬP
     ============================================ */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="glass-card p-8 md:p-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🔐</span>
            <h1
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Admin Dashboard
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Nhập mật khẩu để truy cập
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              id="admin-password"
              type="password"
              className="input-elegant mb-4"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-400 text-sm text-center mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="btn-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Đăng nhập
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  /* ============================================
     GIAO DIỆN DASHBOARD
     ============================================ */
  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-2xl md:text-3xl font-bold gradient-text mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Quản lý khách mời
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Lễ Tốt Nghiệp — Nguyễn Duy Hưng
          </p>
        </motion.div>

        {/* Thống kê */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold gradient-text">
              {records.length}
            </p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
              Tổng phản hồi
            </p>
          </div>
          <div className="glass-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-emerald-400">
              {totalAttending}
            </p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
              Tham gia
            </p>
          </div>
          <div className="glass-card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-red-400">
              {totalDeclined}
            </p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
              Không tham gia
            </p>
          </div>
        </motion.div>

        {/* Nút làm mới */}
        <div className="flex justify-end mb-4">
          <motion.button
            className="btn-outline text-sm px-4 py-2"
            onClick={fetchRecords}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "🔄 Làm mới"}
          </motion.button>
        </div>

        {!!error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Bảng dữ liệu */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-pulse text-[var(--text-muted)]">
                Đang tải dữ liệu...
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-4xl block mb-4">📭</span>
              <p className="text-[var(--text-muted)]">
                Chưa có ai phản hồi. Hãy chia sẻ thiệp mời nhé!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Họ tên</th>
                    <th>Trạng thái</th>
                    <th>Lời chúc</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="text-[var(--text-muted)]">{index + 1}</td>
                      <td className="font-medium text-[var(--text-primary)]">
                        {record.name}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            record.attending ? "status-attending" : "status-declined"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              record.attending ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          {record.attending ? "Tham gia" : "Không tham gia"}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate">
                        {record.message || (
                          <span className="text-[var(--text-muted)] italic">
                            Không có
                          </span>
                        )}
                      </td>
                      <td className="text-[var(--text-muted)] text-xs whitespace-nowrap">
                        {new Date(record.created_at).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn-outline !px-3 !py-1.5 text-xs"
                            onClick={() => setSelectedRecord(record)}
                          >
                            Xem
                          </button>
                          <button
                            className="btn-outline !px-3 !py-1.5 text-xs"
                            onClick={() => openEditModal(record)}
                            disabled={actionLoadingId === record.id}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn-outline !px-3 !py-1.5 text-xs !border-red-400/40 !text-red-300 hover:!border-red-300"
                            onClick={() => handleDelete(record)}
                            disabled={actionLoadingId === record.id}
                          >
                            {actionLoadingId === record.id ? "..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {selectedRecord && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
            >
              <motion.div
                className="glass-card w-full max-w-lg p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                  Chi tiết lời chúc
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-1">Khách mời</p>
                <p className="mb-3 text-[var(--text-primary)]">{selectedRecord.name}</p>
                <p className="text-sm text-[var(--text-muted)] mb-1">Trạng thái</p>
                <p className="mb-3 text-[var(--text-primary)]">
                  {selectedRecord.attending ? "Tham gia" : "Không tham gia"}
                </p>
                <p className="text-sm text-[var(--text-muted)] mb-1">Thời gian</p>
                <p className="mb-3 text-[var(--text-primary)]">
                  {new Date(selectedRecord.created_at).toLocaleString("vi-VN")}
                </p>
                <p className="text-sm text-[var(--text-muted)] mb-1">Lời chúc</p>
                <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {selectedRecord.message || "Không có"}
                </p>
                <div className="flex justify-end mt-6">
                  <button className="btn-outline" onClick={() => setSelectedRecord(null)}>
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingRecord && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRecord(null)}
            >
              <motion.div
                className="glass-card w-full max-w-lg p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Sửa phản hồi
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">Họ tên</label>
                    <input
                      className="input-elegant"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">Trạng thái</label>
                    <select
                      className="input-elegant"
                      value={editAttending ? "yes" : "no"}
                      onChange={(e) => setEditAttending(e.target.value === "yes")}
                    >
                      <option value="yes">Tham gia</option>
                      <option value="no">Không tham gia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-1">Lời chúc</label>
                    <textarea
                      className="input-elegant resize-none"
                      rows={5}
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      maxLength={500}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button className="btn-outline" onClick={() => setEditingRecord(null)}>
                    Hủy
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleSaveEdit}
                    disabled={actionLoadingId === editingRecord.id}
                  >
                    {actionLoadingId === editingRecord.id ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
