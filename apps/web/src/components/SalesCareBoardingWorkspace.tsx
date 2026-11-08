"use client";

import React, { useState } from "react";
import {
  calculateOrderCommissionPlan,
  OrderKind,
  PackageBillingModel,
  SellerRole,
  AdvisedByRole,
} from "@oylg/shared";
import {
  BadgePercent,
  ShieldCheck,
  QrCode,
  Building2,
  UserCheck,
  AlertOctagon,
  Utensils,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface PickupCandidate {
  id: string;
  name: string;
  relation: string;
  phoneMasked: string;
  isAuthorized: boolean;
  badgeNote: string;
}

const PICKUP_CANDIDATES: PickupCandidate[] = [
  {
    id: "pk-1",
    name: "Chị Nguyễn Thị Lan",
    relation: "Mẹ ruột (Chủ tài khoản)",
    phoneMasked: "0905.***.*89",
    isAuthorized: true,
    badgeNote: "Có trong danh sách người được ủy quyền đón · Ảnh đối chiếu khớp 100%",
  },
  {
    id: "pk-2",
    name: "Ông Nguyễn Văn Hòa",
    relation: "Ông ngoại (Đã đăng ký trước)",
    phoneMasked: "0914.***.*22",
    isAuthorized: true,
    badgeNote: "Có trong danh sách người được ủy quyền đón · Đã xác thực CCCD",
  },
  {
    id: "pk-3",
    name: "Anh Lê Văn Lạ (Người quen chưa đăng ký)",
    relation: "Chưa có trong hồ sơ lưu trú",
    phoneMasked: "0977.***.*00",
    isAuthorized: false,
    badgeNote:
      "KHÔNG CÓ TRONG DANH SÁCH ĐƯỢC PHÉP ĐÓN! Hệ thống tự động chặn & gọi xác minh Phụ huynh!",
  },
];

export function SalesCareBoardingWorkspace() {
  // State cho Mô phỏng Hoa hồng 2 cấp đúng pháp luật (M18.5 & 18.5b)
  const [billingModel, setBillingModel] =
    useState<PackageBillingModel>("MONTHLY");
  const [firstPaymentVnd, setFirstPaymentVnd] = useState<number>(4_000_000);
  const [monthlyFeeVnd, setMonthlyFeeVnd] = useState<number>(4_000_000);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(2);
  const [pricePerSessionVnd, setPricePerSessionVnd] = useState<number>(300_000);
  const [orderKind, setOrderKind] = useState<OrderKind>("NEW");
  const [sellerRole, setSellerRole] = useState<SellerRole>("SALES_AGENT");
  const [advisedByRole, setAdvisedByRole] =
    useState<AdvisedByRole>("SALES_AGENT");
  const [isSelfPurchase, setIsSelfPurchase] = useState<boolean>(false);
  const [monthsCollectedCount, setMonthsCollectedCount] = useState<number>(6);

  // State cho Kiosk Quản sinh Nội trú / Bán trú (M21)
  const [selectedPickupId, setSelectedPickupId] = useState<string>("pk-1");
  const [checkinLogs, setCheckinLogs] = useState<
    Array<{ time: string; type: string; detail: string; status: "OK" | "BLOCKED" }>
  >([
    {
      time: "11:45",
      type: "ARRIVE (Đến bán trú)",
      detail: "Quét thẻ QR HS-2026-0089 (Nguyễn Minh Khôi) · Đã gửi thông báo đến Phụ huynh",
      status: "OK",
    },
    {
      time: "12:15",
      type: "MEAL (Ăn trưa)",
      detail: "Suất ăn riêng (Cảnh báo dị ứng tôm/cua biển) · Nghỉ trưa Giường #08",
      status: "OK",
    },
  ]);

  const installments = Array.from(
    { length: monthsCollectedCount },
    () => firstPaymentVnd
  );

  const commissionPlan = calculateOrderCommissionPlan({
    orderCode: "ORD-2026-SIM",
    packageBillingModel: billingModel,
    firstPaymentVnd,
    monthlyFeeVnd,
    sessionsPerWeek,
    pricePerSessionVnd,
    orderKind,
    sellerRole,
    advisedByRole,
    isSelfPurchase,
    collectedInstallmentsVnd: installments,
  });

  const applyPresetScenario = (scenario: 1 | 2 | 3 | 4) => {
    if (scenario === 1) {
      // Ví dụ 1 bảng M18.5: Gói cố vấn 4tr/tháng, đóng theo tháng, CTV A1 bán
      setBillingModel("MONTHLY");
      setFirstPaymentVnd(4_000_000);
      setMonthlyFeeVnd(4_000_000);
      setOrderKind("NEW");
      setSellerRole("SALES_AGENT");
      setAdvisedByRole("SALES_AGENT");
      setIsSelfPurchase(false);
      setMonthsCollectedCount(6);
    } else if (scenario === 2) {
      // Ví dụ 2: Cùng gói, phụ huynh đóng trước 12 tháng = 45 triệu
      setBillingModel("MONTHLY");
      setFirstPaymentVnd(45_000_000);
      setMonthlyFeeVnd(4_000_000);
      setOrderKind("NEW");
      setSellerRole("SALES_AGENT");
      setAdvisedByRole("SALES_AGENT");
      setIsSelfPurchase(false);
      setMonthsCollectedCount(1);
    } else if (scenario === 3) {
      // Ví dụ 3: Gia sư Toán 2 buổi/tuần x 300k, Leader tự bán (15%)
      setBillingModel("PER_SESSION");
      setFirstPaymentVnd(2_400_000);
      setSessionsPerWeek(2);
      setPricePerSessionVnd(300_000);
      setOrderKind("NEW");
      setSellerRole("SALES_LEADER");
      setAdvisedByRole("SALES_LEADER");
      setIsSelfPurchase(false);
      setMonthsCollectedCount(4);
    } else if (scenario === 4) {
      // Ví dụ 4: Đơn mua thêm do CSKH tư vấn -> 0đ hoa hồng CTV
      setBillingModel("MONTHLY");
      setFirstPaymentVnd(4_000_000);
      setMonthlyFeeVnd(4_000_000);
      setOrderKind("ADD_ON");
      setSellerRole("SALES_AGENT");
      setAdvisedByRole("CARE_AGENT");
      setIsSelfPurchase(false);
      setMonthsCollectedCount(3);
    }
  };

  const selectedPickup =
    PICKUP_CANDIDATES.find((p) => p.id === selectedPickupId) ??
    PICKUP_CANDIDATES[0];

  const handleConfirmPickup = () => {
    const nowStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (selectedPickup.isAuthorized) {
      setCheckinLogs((prev) => [
        {
          time: nowStr,
          type: "LEAVE (Đón về an toàn)",
          detail: `Xác nhận ${selectedPickup.name} (${selectedPickup.relation}) đón bé Khôi · Đã bắn thông báo tức thời cho Phụ huynh`,
          status: "OK",
        },
        ...prev,
      ]);
    } else {
      setCheckinLogs((prev) => [
        {
          time: nowStr,
          type: "SECURITY BLOCK (Chặn người đón lạ)",
          detail: `Chặn ${selectedPickup.name} do không nằm trong danh sách được phép đón · Đang gọi khẩn cho Mẹ (Chị Lan)`,
          status: "BLOCKED",
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. BỘ TÍNH HOA HỒNG 2 CẤP ĐÚNG PHÁP LUẬT & LỊCH CHI DẦN PAY_AS_COLLECTED (M18.5 & 18.5b) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white">
              <BadgePercent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                M18.5 & 18.5b · Động Cơ Hoa Hồng 2 Cấp Đúng Pháp Luật (`PAY_AS_COLLECTED`)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                DTHH = max(Kỳ đóng đầu, Giá trị 6 tháng) · Chi dần theo tiền thực thu · Cứng 2 cấp (CTV 10% + Leader 5% hoặc Leader tự bán 15%) · Giữ 14 ngày
              </p>
            </div>
          </div>

          {/* 4 Nút kịch bản chuẩn trong bảng ví dụ M18.5 */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => applyPresetScenario(1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-semibold text-slate-700"
            >
              TH1: Gói 4tr/tháng · CTV bán
            </button>
            <button
              onClick={() => applyPresetScenario(2)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-semibold text-slate-700"
            >
              TH2: Đóng 12T = 45tr · CTV bán
            </button>
            <button
              onClick={() => applyPresetScenario(3)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-semibold text-slate-700"
            >
              TH3: Gia sư Toán · Leader tự bán (15%)
            </button>
            <button
              onClick={() => applyPresetScenario(4)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-700"
            >
              TH4: Đơn mua thêm do CSKH tư vấn (0đ)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột Trái: Tham số đơn hàng */}
          <div className="lg:col-span-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phân loại đơn hàng
                </label>
                <select
                  value={orderKind}
                  onChange={(e) => setOrderKind(e.target.value as OrderKind)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white"
                >
                  <option value="NEW">Đơn mua mới</option>
                  <option value="ADD_ON">Đơn mua thêm môn</option>
                  <option value="RENEWAL">Đơn gia hạn (0% hoa hồng)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Người bán ghi nhận
                </label>
                <select
                  value={sellerRole}
                  onChange={(e) => setSellerRole(e.target.value as SellerRole)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white"
                >
                  <option value="SALES_AGENT">CTV bán (10% + Leader 5%)</option>
                  <option value="SALES_LEADER">Leader tự bán (15%)</option>
                  <option value="NONE">Khách tự đến (0%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bộ phận trực tiếp tư vấn
                </label>
                <select
                  value={advisedByRole}
                  onChange={(e) =>
                    setAdvisedByRole(e.target.value as AdvisedByRole)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white"
                >
                  <option value="SALES_AGENT">CTV trực tiếp tư vấn</option>
                  <option value="SALES_LEADER">Leader trực tiếp tư vấn</option>
                  <option value="CARE_AGENT">CSKH tư vấn (Mua thêm = 0%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiền thực đóng Kỳ đầu (VNĐ)
                </label>
                <input
                  type="number"
                  step={500000}
                  value={firstPaymentVnd}
                  onChange={(e) =>
                    setFirstPaymentVnd(Number(e.target.value) || 0)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelfPurchase}
                  onChange={(e) => setIsSelfPurchase(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                CTV tự mua cho con mình (`is_self_purchase` – Được tính HH, gắn nhãn kiểm toán)
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  Số kỳ phụ huynh thực đóng trước khi dừng ({monthsCollectedCount} kỳ):
                </span>
                <span className="font-bold text-indigo-600">
                  Thử dừng sớm để xem tự hủy phần chưa thu
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={monthsCollectedCount}
                onChange={(e) => setMonthsCollectedCount(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            {/* Rào chắn pháp lý NĐ 40/2018 (M18.5b) */}
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 space-y-1">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kiểm soát Tuân thủ Pháp lý (Chống biến tướng Đa cấp – M18.5b)
              </div>
              <ul className="text-[11px] text-emerald-800 space-y-0.5 list-disc list-inside">
                {commissionPlan.legalComplianceBadges.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột Phải: Kết quả tính DTHH và Bảng chi dần PAY_AS_COLLECTED */}
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl bg-slate-900 text-white p-3">
                <div className="text-[10px] text-slate-400">
                  Cơ sở tính DTHH = max(Kỳ 1, 6T)
                </div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">
                  {commissionPlan.commissionBaseVnd.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-[10px] text-slate-400">
                  Giá trị 6T: {commissionPlan.sixMonthValueVnd.toLocaleString("vi-VN")}đ
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
                <div className="text-[10px] text-indigo-700 font-semibold">
                  Tổng HH chốt (CTV + Leader)
                </div>
                <div className="text-sm font-bold text-indigo-950 mt-0.5">
                  {commissionPlan.totalLockedCommissionVnd.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-[10px] text-indigo-700">
                  CTV: {commissionPlan.totalLockedCtvCommissionVnd.toLocaleString("vi-VN")}đ · Leader:{" "}
                  {commissionPlan.totalLockedLeaderCommissionVnd.toLocaleString("vi-VN")}đ
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Thực chi theo tiền đã thu
                </div>
                <div className="text-sm font-bold text-emerald-950 mt-0.5">
                  {(
                    commissionPlan.totalDisbursedCtvVnd +
                    commissionPlan.totalDisbursedLeaderVnd
                  ).toLocaleString("vi-VN")}
                  đ
                </div>
                <div className="text-[10px] text-emerald-700">
                  Giữ {commissionPlan.holdDays} ngày · Khóa khách {commissionPlan.customerOwnershipLockDays} ngày
                </div>
              </div>

              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
                <div className="text-[10px] text-rose-700 font-semibold">
                  Tự hủy nếu dừng sớm
                </div>
                <div className="text-sm font-bold text-rose-900 mt-0.5">
                  {commissionPlan.uncollectedCancelledVnd.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-[10px] text-rose-700">
                  Không phải thu hồi (Clawback)
                </div>
              </div>
            </div>

            {!commissionPlan.isEligible ? (
              <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-xs font-semibold text-amber-900">
                ⚠️ {commissionPlan.ineligibleReason}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-2 px-3">Kỳ thu</th>
                      <th className="py-2 px-3">Tiền thực thu</th>
                      <th className="py-2 px-3">Chi CTV (10%)</th>
                      <th className="py-2 px-3">
                        Chi Leader ({commissionPlan.leaderRate * 100}%)
                      </th>
                      <th className="py-2 px-3">Ghi chú hạch toán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {commissionPlan.tranches.map((tr) => (
                      <tr key={tr.installmentIndex} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold">
                          Kỳ #{tr.installmentIndex}
                        </td>
                        <td className="py-2 px-3 font-semibold">
                          {tr.collectedAmountVnd.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-2 px-3 text-indigo-700 font-bold">
                          {tr.ctvPayoutVnd.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">
                          {tr.leaderPayoutVnd.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-500">
                          {tr.statusNote}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. KIOSK QUẢN SINH NỘI TRÚ & BÁN TRÚ (M21 – CẦN NGAY TRONG MVP) */}
      <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                M21 · Kiosk Quản Sinh Nội Trú & Bán Trú — Đưa Đón An Toàn (`Authorized Pickups`)
              </h3>
              <p className="text-xs text-slate-500">
                Điểm danh QR 4 mốc · Chỉ người trong danh sách được phép đón mới được nhận học sinh · Tự động đồng bộ giờ ngủ sang M20
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
            Cơ sở: OYLG Trung tâm Buôn Ma Thuột
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột Trái: Kiểm tra người đón học sinh bán trú */}
          <div className="lg:col-span-6 space-y-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Học sinh Bán trú: Nguyễn Minh Khôi (HS-2026-0089)
                </div>
                <div className="text-[11px] text-slate-600">
                  Phòng B2 – Giường #08 · Giờ ngủ TB: 7.8h/đêm (Đạt chuẩn M20)
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg">
                <Utensils className="w-3.5 h-3.5" />
                Dị ứng: Tôm/Cua biển
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-700">
              Chọn người đang đến quầy Quản sinh yêu cầu đón học sinh:
            </div>

            <div className="space-y-2">
              {PICKUP_CANDIDATES.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => setSelectedPickupId(cand.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    selectedPickupId === cand.id
                      ? cand.isAuthorized
                        ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20"
                        : "border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {cand.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({cand.relation})
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 font-medium ${
                        cand.isAuthorized ? "text-teal-700" : "text-rose-700 font-bold"
                      }`}
                    >
                      {cand.badgeNote}
                    </div>
                  </div>
                  {cand.isAuthorized ? (
                    <UserCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  ) : (
                    <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmPickup}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 ${
                selectedPickup.isAuthorized
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              <QrCode className="w-4 h-4" />
              {selectedPickup.isAuthorized
                ? `Xác nhận bàn giao bé Khôi cho ${selectedPickup.name} & Bắn thông báo Phụ huynh`
                : `CHẶN BÀN GIAO CHO NGƯỜI LẠ (${selectedPickup.name}) & GỌI KHẨN CHO PHỤ HUYNH`}
            </button>
          </div>

          {/* Cột Phải: Nhật ký điểm danh & Đưa đón thời gian thực */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              Nhật ký Điểm danh 4 Mốc & Sự việc Nội trú / Bán trú (Real-time Audit)
            </div>
            <div className="space-y-2">
              {checkinLogs.map((log, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-3 text-xs flex items-start justify-between gap-2 ${
                    log.status === "BLOCKED"
                      ? "border-rose-300 bg-rose-50 text-rose-950"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                        {log.time}
                      </span>
                      <span>{log.type}</span>
                    </div>
                    <p className="text-[11px] mt-1 opacity-90">{log.detail}</p>
                  </div>
                  {log.status === "OK" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
