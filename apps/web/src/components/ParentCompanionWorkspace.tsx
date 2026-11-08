"use client";

import React, { useState } from "react";
import {
  calculateModeSwitchDiff,
  evaluateParentNotificationPolicy,
  detectSafetyRisk,
  DeliveryMode,
} from "@oylg/shared";
import {
  STUDENT_CASES,
  APPROVED_KB_ANSWERS,
} from "@/data/oylg-mock-data";
import {
  Sparkles,
  BellRing,
  Video,
  Building,
  Home,
  MessageSquare,
  Send,
  CalendarClock,
  QrCode,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Compass,
} from "lucide-react";

interface ChatTurn {
  id: string;
  sender: "USER" | "AI";
  text: string;
  kbCitation?: string;
  cardType?:
    | "RESCHEDULE_CARD"
    | "MODE_SWITCH_CARD"
    | "PAYOS_QR_CARD"
    | "HUMAN_TICKET_CARD"
    | "SAFETY_EMERGENCY_CARD";
}

export function ParentCompanionWorkspace() {
  const child = STUDENT_CASES[0]; // Nguyễn Minh Khôi – Lớp 9
  const [selectedSessionMode, setSelectedSessionMode] =
    useState<DeliveryMode>("AT_CENTER");
  const [targetSessionMode, setTargetSessionMode] =
    useState<DeliveryMode>("ONLINE_ZOOM");
  const [modeSwitchConfirmed, setModeSwitchConfirmed] =
    useState<boolean>(false);
  const [rescheduledSlot, setRescheduledSlot] = useState<string | null>(null);

  // State cho Trợ lý AI CSKH 24/7 (M19.1)
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      id: "welcome",
      sender: "AI",
      text: "Xin chào chị Nguyễn Thị Lan (Phụ huynh bé Nguyễn Minh Khôi – Lớp 9)! Em là Trợ lý AI CSKH 24/7 của OYLG. Em chỉ trả lời từ Kho tri thức đã duyệt (kb_answers) và dữ liệu thực của bé Khôi. Chị có thể bấm các gợi ý bên dưới để đổi lịch, đổi hình thức học hoặc tra cứu học phí ạ.",
      kbCitation: "KB-CORE-WELCOME · Duyệt bởi AI_SUPERVISOR",
    },
  ]);

  const modeDiff = calculateModeSwitchDiff(
    {
      basePriceVnd: 200_000,
      expertTier: 3,
      grade: child.grade,
      classType: "ONE_ON_ONE",
    },
    selectedSessionMode,
    targetSessionMode
  );

  const handleSendChat = (presetText?: string) => {
    const query = (presetText ?? chatInput).trim();
    if (!query) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      sender: "USER",
      text: query,
    };

    // Bước 1: Kiểm tra an toàn tâm lý khẩn cấp ngoài giờ (M19.1 & M14)
    const safety = detectSafetyRisk(query);
    if (safety.level === "HIGH" || safety.level === "MEDIUM") {
      const safetyReply: ChatTurn = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: "⚠️ TÍN HIỆU AN TOÀN HỌC SINH (M14): Trợ lý AI tuyệt đối không tự tư vấn tâm lý. Hệ thống đã gửi thông báo đẩy + SMS khẩn cấp đến ThS. Lê Minh Tâm (Cố vấn cuộc sống phụ trách) và Chuyên gia Tâm lý OYLG. Vui lòng gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí 24/7) hoặc 115.",
        kbCitation: "PROTOCOL-M14-EMERGENCY · Kích hoạt tự động 24/7",
        cardType: "SAFETY_EMERGENCY_CARD",
      };
      setChatHistory((prev) => [...prev, userTurn, safetyReply]);
      setChatInput("");
      return;
    }

    // Bước 2: Tìm trong Kho câu trả lời đã duyệt (APPROVED_KB_ANSWERS)
    const lower = query.toLowerCase();
    const matchedKb = APPROVED_KB_ANSWERS.find((kb) =>
      kb.triggers.some((t) => lower.includes(t))
    );

    let aiReply: ChatTurn;
    if (matchedKb) {
      aiReply = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: matchedKb.approvedAnswer,
        kbCitation: `${matchedKb.topic} · ${matchedKb.approvedBy}`,
        cardType: matchedKb.generativeCardType,
      };
    } else {
      // Ngoài phạm vi kho đã duyệt -> Bắt buộc chuyển người (Nguyên tắc #8 & M19.1)
      aiReply = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: "Câu hỏi này nằm ngoài Kho câu trả lời chuẩn đã duyệt (kb_answers) hoặc liên quan đến thẩm quyền chuyên môn/hoàn tiền. Theo Nguyên tắc #8 của OYLG, AI không tự suy diễn câu trả lời mà đã tạo Ticket #TK-2026-882 chuyển cho Chuyên viên CSKH phụ trách gia đình (cam kết phản hồi trong SLA giờ làm việc).",
        kbCitation: "GUARDRAIL-M19.1 · Chuyển người khi ngoài kho đã duyệt",
        cardType: "HUMAN_TICKET_CARD",
      };
    }

    setChatHistory((prev) => [...prev, userTurn, aiReply]);
    setChatInput("");
  };

  const dailyDigestPolicy = evaluateParentNotificationPolicy(
    "HOMEWORK_MISSED_REPEAT",
    false
  );
  const weeklyMilestonePolicy = evaluateParentNotificationPolicy(
    "POSITIVE_MILESTONE",
    true
  );

  return (
    <div className="space-y-6">
      {/* 1. FEED THÔNG MINH "1 TIN TỔNG HỢP/NGÀY" & BẢN ĐỒ THÀNH CÔNG CỦA CON (M01.4-7, M13, M20.12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Calm UI Daily Digest & Bản đồ thành công */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <BellRing className="w-3.5 h-3.5" />
                M01.4-7 & M20.12 · Chống Làm Phiền: Tối Đa 1 Tin Tổng Hợp / Ngày
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Bảng Tin Đồng Hành Gia Đình — Bé {child.fullName} (Lớp {child.grade})
              </h2>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
              Ví buổi học: {child.sessionCreditsRemaining} buổi
            </span>
          </div>

          {/* Bản đồ thành công (R1 Career North Star) */}
          <div className="rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <Compass className="w-4 h-4 text-amber-300" />
                Bản Đồ Thành Công (R1 – Đã duyệt bởi Chuyên gia Hướng nghiệp)
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[11px]">
                Độ khớp: {child.careerGoal.fitPercentage}%
              </span>
            </div>
            <div className="text-sm font-bold text-amber-300">
              Đích nghề nghiệp: {child.careerGoal.targetCareer}
            </div>
            <div className="text-xs text-slate-200">
              Trường mục tiêu: <strong>{child.careerGoal.targetUniversity}</strong> · Khối:{" "}
              {child.careerGoal.admissionBlock}
            </div>
          </div>

          {/* Thẻ Daily Digest & Weekly Digest */}
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  📬 Bản Tin Tổng Hợp Cuối Ngày (19:00 Hôm nay)
                </span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                  {dailyDigestPolicy.deliveryMode}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                • <strong>Toán Lớp 9 (Buổi 14):</strong> Con đã nắm vững Hằng đẳng thức số 2 (TOAN.08.HDT.01), hoàn thành Exit Check đạt 4/5 câu.<br />
                • <strong>Bán trú M21:</strong> Đã điểm danh đến lúc 11:45, ăn trưa suất riêng (không hải sản vỏ cứng), tự học có giám sát 90 phút.<br />
                • <strong>Việc phụ huynh phối hợp:</strong> Nhắc con làm 3 bài tự luyện Căn thức trước thứ Năm (mất khoảng 20 phút).
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">
                  🎉 Gộp Bản Tin Tuần (Chủ Nhật) – Tin vui & Huy hiệu
                </span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700">
                  {weeklyMilestonePolicy.deliveryMode}
                </span>
              </div>
              <p className="text-xs text-emerald-800">
                Con vừa lấp xong hoàn toàn lỗ hổng gốc Đại số Lớp 8 (TOAN.08.HDT.01) sớm hơn kế hoạch 1 tuần!
              </p>
            </div>
          </div>

          {/* Đổi hình thức học linh hoạt theo từng buổi (M09.1) */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  M09.1 · Đổi Hình Thức Học Theo Từng Buổi (Tự tính chênh lệch)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Buổi tới: Thứ Năm 19:30 – Toán Lớp 9 cùng Thầy Đặng Quốc Việt
                </p>
              </div>
              <span className="text-[10px] font-semibold bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-700">
                Hiện tại: {selectedSessionMode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "ONLINE_ZOOM", label: "Online Zoom (1.0x)", icon: <Video className="w-3.5 h-3.5" /> },
                  { id: "AT_CENTER", label: "Tại Trung tâm (1.2x)", icon: <Building className="w-3.5 h-3.5" /> },
                  { id: "AT_HOME", label: "Tại Nhà HS (1.5x)", icon: <Home className="w-3.5 h-3.5" /> },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setTargetSessionMode(m.id);
                    setModeSwitchConfirmed(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    targetSessionMode === m.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>

            <div className="rounded-lg bg-white p-3 border border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-semibold text-slate-800">
                  {modeDiff.fromPriceVnd.toLocaleString("vi-VN")}đ →{" "}
                  {modeDiff.toPriceVnd.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-[11px] text-slate-500">
                  {modeDiff.actionSummary}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSessionMode(targetSessionMode);
                  setModeSwitchConfirmed(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                {modeSwitchConfirmed ? "✓ Đã gửi xác nhận 2 bên" : "Gửi yêu cầu đổi hình thức"}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Buổi học Zoom tự động ghi hình kiểm soát chất lượng · Lưu đến{" "}
                <strong>hết gói học + 30 ngày</strong> rồi tự xóa (Chốt v1.0 – B8-5b).
              </span>
            </div>
          </div>
        </div>

        {/* Cột Phải: Trợ lý AI CSKH 24/7 với Generative UI Cards (M19.1) */}
        <div className="lg:col-span-6 rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    M19.1 · Trợ Lý AI CSKH 24/7 (Generative UI Copilot)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chỉ trả lời bằng Kho câu trả lời đã duyệt (`kb_answers`) + Dữ liệu thật của khách
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                ● Online 24/7
              </span>
            </div>

            {/* Các nút gợi ý thử nhanh Generative UI */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() =>
                  handleSendChat("Chị muốn dời lịch buổi Toán tối thứ Năm của bé Khôi")
                }
                className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                📅 Thử: Dời lịch buổi học (Hiện Thẻ Dời Lịch)
              </button>
              <button
                onClick={() =>
                  handleSendChat("Cho chị mã QR thanh toán gia hạn gói 6 tháng và ưu đãi")
                }
                className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                💳 Thử: Thanh toán học phí (Hiện Thẻ PayOS VietQR)
              </button>
              <button
                onClick={() =>
                  handleSendChat("Chị muốn yêu cầu hoàn tiền gói học do gia đình chuyển nơi ở")
                }
                className="text-[11px] font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200"
              >
                🙋 Thử: Câu ngoài kho / Hoàn tiền (Chuyển Người)
              </button>
            </div>

            {/* Khung hội thoại */}
            <div className="h-96 overflow-y-auto space-y-3 pr-1 bg-slate-50/70 rounded-xl p-3 border border-slate-200">
              {chatHistory.map((turn) => (
                <div
                  key={turn.id}
                  className={`flex flex-col ${
                    turn.sender === "USER" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                      turn.sender === "USER"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    }`}
                  >
                    <p>{turn.text}</p>

                    {turn.kbCitation && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] font-mono text-indigo-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Nguồn đã duyệt: {turn.kbCitation}
                      </div>
                    )}

                    {/* GENERATIVE UI CARD 1: THẺ DỜI LỊCH 1-CHẠM */}
                    {turn.cardType === "RESCHEDULE_CARD" && (
                      <div className="mt-3 rounded-xl bg-indigo-50/70 border border-indigo-200 p-3 space-y-2 text-slate-900">
                        <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                          <span className="flex items-center gap-1">
                            <CalendarClock className="w-3.5 h-3.5" />
                            Thẻ Dời Lịch Tự Phục Vụ (Báo trước ≥ 12h · Lần 1/2 trong tháng)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            "Thứ Bảy (09:00 – 10:30)",
                            "Chủ Nhật (15:00 – 16:30)",
                          ].map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setRescheduledSlot(slot)}
                              className={`p-2 rounded-lg text-[11px] font-semibold border transition ${
                                rescheduledSlot === slot
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white text-slate-800 border-slate-200 hover:border-indigo-400"
                              }`}
                            >
                              {rescheduledSlot === slot ? `✓ Đã dời sang ${slot}` : slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* GENERATIVE UI CARD 2: THẺ VIETQR PAYOS CHÍNH THỐNG */}
                    {turn.cardType === "PAYOS_QR_CARD" && (
                      <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-2 text-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                            <QrCode className="w-4 h-4 text-emerald-700" />
                            VietQR PayOS Tự Đối Soát – Công ty All Your Life (OYLG)
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                            Ưu đãi 6T: -7%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                          <div>
                            <div>Mã đơn: <strong>ORD-2026-8891</strong></div>
                            <div>Thụ hưởng: <strong>CONG TY TNHH ALL YOUR LIFE (OYLG)</strong></div>
                            <div className="text-emerald-700 font-bold">
                              Số tiền: 11.160.000đ (Đã giảm 7%)
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-[10px] text-center leading-tight">
                            PAYOS
                            <br />
                            QR
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GENERATIVE UI CARD 3: THẺ CHUYỂN NGƯỜI / TICKET */}
                    {turn.cardType === "HUMAN_TICKET_CARD" && (
                      <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-1 text-amber-950">
                        <div className="text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                          Đã tạo Ticket #TK-2026-882 → Giao CSKH Phụ trách Gia đình
                        </div>
                        <div className="text-[11px]">
                          Mọi yêu cầu hoàn tiền thuộc thẩm quyền <strong>Ban Giám Đốc duyệt</strong> (Hoàn 100% phần chưa học trong 14 ngày đầu – B3-26).
                        </div>
                      </div>
                    )}

                    {/* GENERATIVE UI CARD 4: KHẨN CẤP AN TOÀN 111 / 115 */}
                    {turn.cardType === "SAFETY_EMERGENCY_CARD" && (
                      <div className="mt-3 rounded-xl bg-rose-950 text-white p-3 space-y-1.5">
                        <div className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
                          <PhoneCall className="w-4 h-4" />
                          Tổng đài Quốc gia Bảo vệ Trẻ em: 111 (24/7) · Cấp cứu: 115
                        </div>
                        <div className="text-[11px] text-rose-100">
                          Đã tạo Cờ Đỏ M14 & gửi SMS khẩn cấp cho Cố vấn cuộc sống ThS. Lê Minh Tâm.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input gửi tin nhắn */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Nhắn Trợ lý AI 24/7 (VD: 'dời lịch', 'đổi hình thức zoom', 'thanh toán qr', 'hoàn tiền')..."
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
            <button
              onClick={() => handleSendChat()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
