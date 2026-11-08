"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import { maskContactInfo, detectSafetyRisk } from "@oylg/shared";
import {
  Calendar,
  CheckCircle2,
  Send,
  AlertOctagon,
  PhoneCall,
  FileText,
  Video,
  Building,
  Home,
} from "lucide-react";

export default function TutorSessionsPage() {
  const { bookings, lessonLogs, submitLessonLog } = usePlatform();

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings[0]?.id ?? "bk-101"
  );
  const [masteryLevel, setMasteryLevel] = useState<
    "CHƯA HIỂU" | "HIỂU MỘT PHẦN" | "NẮM VỮNG"
  >("NẮM VỮNG");
  const [mood, setMood] = useState<string>("Tập trung cao");
  const [focusScore, setFocusScore] = useState<number>(5);
  const [noteToParent, setNoteToParent] = useState<string>(
    "Hôm nay con đã nắm vững cách khai triển hằng đẳng thức và làm đúng 5/5 câu kiểm tra nhanh cuối buổi. Phụ huynh nhắc con hoàn thành bài tự luyện trang 24 nhé."
  );
  const [noteToCoach, setNoteToCoach] = useState<string>(
    "Con đã lấp xong lỗ hổng TOAN.08.HDT.01, tuần tới có thể tăng tốc phần Căn bậc hai Lớp 9."
  );
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const currentBooking =
    bookings.find((b) => b.id === selectedBookingId) ?? bookings[0];

  const maskedParentNote = maskContactInfo(noteToParent);
  const safetyCheck = detectSafetyRisk(`${noteToParent} ${noteToCoach}`);

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;

    submitLessonLog({
      bookingId: currentBooking.id,
      studentName: currentBooking.studentName,
      subject: currentBooking.subject,
      unitCode: currentBooking.unitCode,
      masteryLevel,
      mood,
      focusScore,
      sanitizedNoteToParent: maskedParentNote.sanitizedText,
      internalNoteToCoach: noteToCoach,
      safetyLevel: safetyCheck.level,
    });

    setSubmittedNotice(
      `Đã lưu biên bản buổi học "${currentBooking.title}". Phụ huynh đã nhận được nhận xét trên Cổng Phụ Huynh và hệ thống đã ghi nhận thù lao buổi dạy!`
    );
    setTimeout(() => setSubmittedNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Lịch Giảng Dạy & Sổ Biên Bản Buổi Học Điện Tử
            </h1>
            <p className="text-xs text-slate-500">
              Chuyên gia hoàn thành biên bản trong 24h sau buổi dạy để cập nhật Bản đồ nhiệt kiến thức và ghi nhận thù lao
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bookings.map((bk) => {
            const isSelected = bk.id === currentBooking?.id;
            return (
              <button
                key={bk.id}
                onClick={() => setSelectedBookingId(bk.id)}
                className={`text-left p-4 rounded-xl border transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-700">
                      {bk.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bk.noteSubmitted
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {bk.noteSubmitted ? "✓ Đã nộp biên bản" : "Chờ nhập biên bản"}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    HS: {bk.studentName}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-1">
                    {bk.title}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{bk.dateLabel}</span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    {bk.mode === "ONLINE_ZOOM" ? (
                      <Video className="w-3 h-3 text-indigo-600" />
                    ) : bk.mode === "AT_CENTER" ? (
                      <Building className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Home className="w-3 h-3 text-amber-600" />
                    )}
                    {bk.mode}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Nhập Biên Bản Cấu Trúc 60 Giây */}
      {currentBooking && (
        <form
          onSubmit={handleSaveRecord}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Nhập Biên Bản Buổi Học: {currentBooking.studentName} —{" "}
                {currentBooking.subject} ({currentBooking.unitCode})
              </h2>
              <p className="text-xs text-slate-500">
                Hệ thống tự động kiểm tra và che thông tin liên hệ cá nhân (SĐT/Zalo) trước khi gửi sang Cổng Phụ Huynh
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setNoteToParent(
                    "Em làm bài rất tốt. Chị nhắn riêng cho thầy qua zalo.me/thayviet hoặc số không chín tám bảy sáu năm bốn ba hai một nhé!"
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
              >
                Thử tình huống Gia sư ghi kèm SĐT/Zalo
              </button>
              <button
                type="button"
                onClick={() =>
                  setNoteToCoach(
                    "Hôm nay học sinh khóc trong giờ, tâm sự bị bắt nạt và có ý nghĩ tự hại."
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold text-rose-700 border border-rose-200"
              >
                Thử tình huống Phát hiện Cờ An toàn Tâm lý
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mức độ nắm bài của học sinh ở đơn vị kiến thức {currentBooking.unitCode}:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["CHƯA HIỂU", "HIỂU MỘT PHẦN", "NẮM VỮNG"] as const).map(
                    (lv) => (
                      <button
                        type="button"
                        key={lv}
                        onClick={() => setMasteryLevel(lv)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                          masteryLevel === lv
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {lv}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tâm trạng quan sát được
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="Tập trung cao">Tập trung cao</option>
                    <option value="Hào hứng">Hào hứng</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Mệt mỏi">Mệt mỏi</option>
                    <option value="Căng thẳng">Căng thẳng</option>
                    <option value="Buồn bất thường">Buồn bất thường</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Điểm tập trung (1–5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={focusScore}
                    onChange={(e) => setFocusScore(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhận xét gửi Phụ huynh & Bài tập về nhà:
                </label>
                <textarea
                  rows={3}
                  value={noteToParent}
                  onChange={(e) => setNoteToParent(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú chuyên môn nội bộ gửi Cố vấn cuộc sống (Phụ huynh không thấy):
                </label>
                <textarea
                  rows={2}
                  value={noteToCoach}
                  onChange={(e) => setNoteToCoach(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Bản xem trước gửi Phụ huynh (Đã qua Bộ lọc Bảo mật):
                    </span>
                    {maskedParentNote.hasViolation && (
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Đã tự động che {maskedParentNote.detectedItems.length} SĐT/Zalo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {maskedParentNote.sanitizedText}
                  </p>
                </div>

                {safetyCheck.level !== "NONE" && (
                  <div className="rounded-xl bg-rose-950 text-white p-4 space-y-2">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-rose-400" />
                      PHÁT HIỆN DẤU HIỆU AN TOÀN TÂM LÝ (MỨC {safetyCheck.level})
                    </div>
                    <p className="text-xs text-rose-100">
                      {safetyCheck.ImmediateBannerMessage}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold text-emerald-300 pt-1">
                      <PhoneCall className="w-4 h-4" />
                      <span>Tổng đài Bảo vệ Trẻ em: 111 · Cấp cứu: 115</span>
                    </div>
                  </div>
                )}

                {submittedNotice && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{submittedNotice}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                Lưu Biên Bản Buổi Học & Đồng Bộ Cổng Phụ Huynh
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Lịch sử biên bản đã nộp */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Nhật Ký Biên Bản Buổi Học Đã Ghi Nhận ({lessonLogs.length})
          </h3>
        </div>
        <div className="space-y-2.5">
          {lessonLogs.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-slate-200 p-3.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>
                  {l.studentName} — {l.subject} ({l.unitCode})
                </span>
                <span className="text-emerald-700">{l.masteryLevel}</span>
              </div>
              <p className="text-slate-600">
                <strong>Gửi Phụ huynh:</strong> {l.sanitizedNoteToParent}
              </p>
              <p className="text-indigo-700">
                <strong>Nội bộ Cố vấn:</strong> {l.internalNoteToCoach}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
