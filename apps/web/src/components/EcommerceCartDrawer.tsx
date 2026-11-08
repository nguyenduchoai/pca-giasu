"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlatform, EcommerceOrderRecord } from "@/lib/platform-store";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
} from "lucide-react";

export function EcommerceCartDrawer() {
  const router = useRouter();
  const {
    ecomProducts,
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    voucherCode,
    setVoucherCode,
    checkoutCartWithVietQr,
    loginAsPersona,
  } = usePlatform();

  const [step, setStep] = useState<"CART" | "VIETQR" | "RECEIPT">("CART");
  const [parentName, setParentName] = useState("Chị Nguyễn Thị Lan");
  const [phone, setPhone] = useState("0905123489");
  const [studentName, setStudentName] = useState("Nguyễn Minh Khôi");
  const [grade, setGrade] = useState<number>(9);
  const [refCode, setRefCode] = useState("CTV-A102");
  const [completedOrder, setCompletedOrder] =
    useState<EcommerceOrderRecord | null>(null);

  if (!isCartOpen) return null;

  const subtotalVnd = cartItems.reduce(
    (sum, item) => sum + item.product.netPriceVnd * item.quantity,
    0
  );
  const totalSessions = cartItems.reduce(
    (sum, item) => sum + item.product.sessionsGranted * item.quantity,
    0
  );
  const normalizedVoucher = voucherCode.trim().toUpperCase();
  const voucherDiscountVnd =
    normalizedVoucher === "OYLG2026"
      ? Math.min(500_000, subtotalVnd)
      : normalizedVoucher === "BMT10"
      ? Math.min(1_000_000, Math.round(subtotalVnd * 0.1))
      : 0;
  const netPayableVnd = Math.max(0, subtotalVnd - voucherDiscountVnd);

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const order = checkoutCartWithVietQr({
      parentName,
      phone,
      studentName,
      grade,
      refCode,
      channel: "WEBSITE_ECOM",
    });
    loginAsPersona("PARENT_LAN");
    setCompletedOrder(order);
    setStep("RECEIPT");
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep("CART");
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex justify-end p-0 sm:p-4">
      <div className="w-full max-w-xl bg-[#FBF9F5] sm:rounded-[2rem] border border-stone-200/90 shadow-2xl flex flex-col h-full max-h-screen overflow-hidden">
        {/* Header Ngăn kéo E-Commerce */}
        <div className="px-6 py-5 bg-white border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#112A22] text-[#FBF9F5] flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                Thương Mại Điện Tử & Thanh Toán Học Phí
              </div>
              <h2 className="text-base font-bold text-stone-900">
                {step === "CART"
                  ? `Giỏ Gói Học Gia Đình (${cartItems.reduce((s, i) => s + i.quantity, 0)})`
                  : step === "VIETQR"
                  ? "Thông Tin Học Sinh & Quét Mã VietQR"
                  : "Hóa Đơn Điện Tử & Kích Hoạt Ví Buổi Học"}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thanh bước tiến trình */}
        <div className="px-6 py-2.5 bg-stone-100/80 border-b border-stone-200/60 grid grid-cols-3 gap-2 text-[11px] font-semibold">
          <div
            className={`flex items-center gap-1.5 ${
              step === "CART" ? "text-emerald-900 font-bold" : "text-stone-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-800 text-white inline-flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Chọn gói & Ưu đãi</span>
          </div>
          <div
            className={`flex items-center gap-1.5 ${
              step === "VIETQR" ? "text-emerald-900 font-bold" : "text-stone-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-800 text-white inline-flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Thanh toán VietQR</span>
          </div>
          <div
            className={`flex items-center gap-1.5 ${
              step === "RECEIPT" ? "text-emerald-900 font-bold" : "text-stone-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-800 text-white inline-flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Cộng Ví buổi học</span>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === "CART" && (
            <>
              {cartItems.length === 0 ? (
                <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
                  <div className="text-base font-bold text-stone-900">
                    Giỏ gói học đang trống
                  </div>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Phụ huynh có thể chọn một trong các gói Hướng nghiệp, Tầm soát 3 Trụ cột hoặc Gói Đồng hành Gia sư bên dưới để bắt đầu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {item.product.tierLabel}
                          </span>
                          <h3 className="text-sm font-bold text-stone-900 mt-1">
                            {item.product.title}
                          </h3>
                          {item.customNote && (
                            <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                              Cấu hình: {item.customNote}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition"
                          title="Xóa khỏi giỏ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-700"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-stone-900 w-6 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] text-emerald-800 font-semibold ml-2">
                            +{item.product.sessionsGranted * item.quantity} buổi vào Ví
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-stone-400 line-through font-mono">
                            {(
                              item.product.listPriceVnd * item.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </div>
                          <div className="text-sm font-extrabold text-stone-900 font-mono">
                            {(
                              item.product.netPriceVnd * item.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mã ưu đãi (Voucher) */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    Mã Ưu Đãi Học Phí (Voucher)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setVoucherCode("OYLG2026")}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition ${
                        normalizedVoucher === "OYLG2026"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      OYLG2026 (-500k)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoucherCode("BMT10")}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition ${
                        normalizedVoucher === "BMT10"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      BMT10 (-10%)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã ưu đãi (VD: OYLG2026 hoặc BMT10)..."
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-mono font-bold uppercase text-stone-900 focus:border-emerald-700 focus:outline-none"
                />
                {voucherDiscountVnd > 0 && (
                  <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center justify-between">
                    <span>Đã áp dụng mã ưu đãi {normalizedVoucher}:</span>
                    <span className="font-mono font-bold">
                      -{voucherDiscountVnd.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>

              {/* Gợi ý thêm nhanh các gói dịch vụ khác */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Danh mục các Gói Dịch Vụ Chính Thức (Chọn để thêm vào giỏ)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ecomProducts.map((prod) => {
                    const inCart = cartItems.some(
                      (c) => c.product.id === prod.id
                    );
                    return (
                      <div
                        key={prod.id}
                        className="rounded-xl border border-stone-200/80 bg-white px-3.5 py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-emerald-800">
                            {prod.tierLabel} · +{prod.sessionsGranted} buổi
                          </div>
                          <div className="text-xs font-bold text-stone-900 truncate">
                            {prod.title}
                          </div>
                          <div className="text-xs font-mono font-bold text-stone-700">
                            {prod.netPriceVnd.toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(prod, undefined, false)}
                          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            inCart
                              ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                              : "bg-[#112A22] text-white hover:bg-emerald-950"
                          }`}
                        >
                          {inCart ? "+ Thêm 1" : "+ Chọn mua"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step === "VIETQR" && (
            <form
              id="ecom-checkout-form"
              onSubmit={handleConfirmPayment}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Thông tin Phụ huynh & Học sinh thụ hưởng
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Họ tên Phụ huynh
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Số điện thoại nhận thông báo
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Họ tên Học sinh
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Khối lớp
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        className="w-full rounded-xl border border-stone-200 px-2.5 py-2 text-xs font-semibold bg-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                          <option key={g} value={g}>
                            Lớp {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Mã CTV giới thiệu
                      </label>
                      <input
                        type="text"
                        value={refCode}
                        onChange={(e) => setRefCode(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 px-2.5 py-2 text-xs font-mono font-bold text-emerald-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Khung VietQR chuẩn PayOS */}
              <div className="rounded-3xl bg-[#112A22] text-[#FBF9F5] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                      Cổng Thanh Toán Tự Động VietQR · PayOS
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      CONG TY TNHH ALL YOUR LIFE
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-amber-300" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-white p-3 flex flex-col items-center justify-center text-stone-900 shrink-0 shadow-md">
                    <QrCode className="w-20 h-20 text-[#112A22]" />
                    <span className="text-[9px] font-mono font-bold tracking-wider mt-1">
                      VIETQR PAYOS
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex justify-between">
                      <span className="text-stone-300">Ngân hàng:</span>
                      <span className="font-bold">Vietcombank — CN Đắk Lắk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-300">Số tài khoản:</span>
                      <span className="font-mono font-bold text-amber-300">
                        1029 384 756
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-300">Số tiền thanh toán:</span>
                      <span className="font-mono text-base font-extrabold text-emerald-300">
                        {netPayableVnd.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-300">Số buổi cộng vào Ví:</span>
                      <span className="font-bold text-amber-200">
                        +{totalSessions} buổi học
                      </span>
                    </div>
                    <div className="pt-1 text-[11px] text-stone-300">
                      Nội dung CK:{" "}
                      <strong className="font-mono text-white">
                        OYLG {phone.slice(-4)} {refCode}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {step === "RECEIPT" && completedOrder && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Mã đơn hàng: {completedOrder.orderCode}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-2">
                  Thanh Toán Thành Công & Đã Cộng +{completedOrder.sessionsGranted} Buổi Học!
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Hệ thống đã kích hoạt gói dịch vụ cho học sinh{" "}
                  <strong>{completedOrder.studentName}</strong> và đồng bộ hóa đơn vào Cổng Phụ Huynh.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Gói dịch vụ:</span>
                  <span className="font-bold text-stone-900 text-right max-w-[65%]">
                    {completedOrder.itemsSummary}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Thực thu qua VietQR:</span>
                  <span className="font-mono font-extrabold text-emerald-800">
                    {completedOrder.netPaidVnd.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Số buổi học đã nạp vào Ví:</span>
                  <span className="font-bold text-indigo-700">
                    +{completedOrder.sessionsGranted} buổi
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Bảo lãnh hoàn tiền 100%:</span>
                  <span className="font-semibold text-stone-800">
                    14 ngày đầu cho mọi buổi chưa học
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    router.push("/parent");
                  }}
                  className="py-3 px-4 rounded-2xl bg-[#112A22] text-white text-xs font-bold hover:bg-emerald-950 transition flex items-center justify-center gap-2"
                >
                  <span>Vào Cổng Phụ Huynh Kiểm Tra Ví</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    router.push("/student");
                  }}
                  className="py-3 px-4 rounded-2xl border border-stone-300 bg-white text-stone-800 text-xs font-bold hover:bg-stone-100 transition"
                >
                  Mở Không Gian Học Sinh Làm Bài Test
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Tổng kết Giỏ hàng & Nút hành động */}
        {step !== "RECEIPT" && (
          <div className="p-6 bg-white border-t border-stone-200/80 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Tạm tính ({totalSessions} buổi học):</span>
                <span className="font-mono font-semibold">
                  {subtotalVnd.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {voucherDiscountVnd > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Ưu đãi Voucher ({normalizedVoucher}):</span>
                  <span className="font-mono">
                    -{voucherDiscountVnd.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1 border-t border-stone-100">
                <span>Tổng thanh toán:</span>
                <span className="font-mono text-base text-emerald-900">
                  {netPayableVnd.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Bảo lãnh hoàn 100% học phí các buổi chưa học trong 14 ngày đầu tiên.
              </span>
            </div>

            {step === "CART" ? (
              <button
                type="button"
                disabled={cartItems.length === 0}
                onClick={() => setStep("VIETQR")}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#112A22] hover:bg-emerald-950 disabled:bg-stone-300 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Tiếp Tục Thanh Toán Qua VietQR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStep("CART")}
                  className="py-3 px-3 rounded-2xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
                >
                  ← Quay lại Giỏ
                </button>
                <button
                  type="submit"
                  form="ecom-checkout-form"
                  className="col-span-2 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đã Chuyển Khoản & Kích Hoạt</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
