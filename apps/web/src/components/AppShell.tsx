"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  usePlatform,
  PERSONA_ACCOUNTS,
  ActivePersonaId,
} from "@/lib/platform-store";
import { EcommerceCartDrawer } from "@/components/EcommerceCartDrawer";
import {
  Sparkles,
  BookOpenCheck,
  BadgePercent,
  Building2,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
  X,
  Send,
  Puzzle,
  LogOut,
  Globe,
  Gauge,
  ArrowUpRight,
  Lock,
  ShoppingBag,
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isLoggedIn,
    loginAsPersona,
    logout,
    currentPersona,
    studentCases,
    selectedStudentId,
    setSelectedStudentId,
    questions,
    leads,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    ezyPageFragments,
    isEzyLoginModalOpen,
    setIsEzyLoginModalOpen,
    cartItems,
    setIsCartOpen,
    orders,
  } = usePlatform();

  const [loginPhoneInput, setLoginPhoneInput] = useState("0905123489");
  const [loginPasswordInput, setLoginPasswordInput] = useState("••••••••");
  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [copilotMessages, setCopilotMessages] = useState<
    Array<{ role: "AI" | "USER"; text: string }>
  >([
    {
      role: "AI",
      text: "Xin chào Quý Phụ huynh và Học sinh! Em là Trợ lý Tư vấn 24/7 của All Your Life (OYLG). Anh/chị cần tư vấn về lộ trình 3 tầng, học phí từng buổi hay cách thức tầm soát lỗ hổng kiến thức cho con?",
    },
  ]);

  const isPublicWebsiteRoute =
    pathname === "/" || pathname.startsWith("/pages/");

  const isEnterpriseAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ezyadmin") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/operations");

  const activeStudent =
    studentCases.find((s) => s.id === selectedStudentId) ?? studentCases[0];

  // Persona hiển thị phải khớp với cổng đang mở (tránh hiện "Phụ huynh" trên trang Cố vấn/Quản trị)
  const routePersonaId: ActivePersonaId | undefined = pathname.startsWith("/parent")
    ? "PARENT_LAN"
    : pathname.startsWith("/student")
    ? "STUDENT_KHOI"
    : pathname.startsWith("/coach/sessions")
    ? "TUTOR_VIET"
    : pathname.startsWith("/coach")
    ? "COACH_TAM"
    : pathname.startsWith("/studio")
    ? "APPROVER_TRACIE"
    : pathname.startsWith("/operations/sales")
    ? "SALES_LEADER_MINH"
    : pathname.startsWith("/operations/boarding")
    ? "BOARDING_STAFF_NAM"
    : pathname.startsWith("/admin") || pathname.startsWith("/ezyadmin")
    ? "ADMIN_OYLG"
    : undefined;
  const personaFitsRoute =
    isLoggedIn &&
    (pathname.startsWith(currentPersona.defaultRoute.split("/").slice(0, 2).join("/")) ||
      (currentPersona.id === "ADMIN_OYLG" && isEnterpriseAdminRoute));
  const displayPersona =
    personaFitsRoute || !routePersonaId
      ? currentPersona
      : PERSONA_ACCOUNTS.find((p) => p.id === routePersonaId) ?? currentPersona;
  const isParentPortal = pathname.startsWith("/parent");
  const isStudentPortal = pathname.startsWith("/student");
  const enterprisePageTitle = pathname.startsWith("/studio")
    ? "Phê duyệt Học liệu & Đề AI"
    : pathname.startsWith("/operations/sales")
    ? "Đơn hàng, Tuyển sinh & Hoa hồng"
    : pathname.startsWith("/operations/boarding")
    ? "Nội trú, Bán trú & Đón trả QR"
    : pathname.startsWith("/ezyadmin/page-fragments")
    ? "Nội dung Website (CMS)"
    : "Tổng quan Ban Điều hành";

  const pendingApprovalsCount = questions.filter(
    (q) => q.finalApprovalStatus === "PENDING_TRACIE_ANH"
  ).length;
  const newLeadsCount = leads.filter((l) => l.stage === "NEW").length;
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const footerCompanyIntro =
    ezyPageFragments.find(
      (f) => f.pageName === "footer" && f.fragmentName === "company_intro"
    )?.contentVi ?? "";

  const footerContactInfo =
    ezyPageFragments.find(
      (f) => f.pageName === "footer" && f.fragmentName === "contact_information"
    )?.contentVi ?? "";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEzyLoginModalOpen(false);
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setIsEzyLoginModalOpen, setIsCartOpen]);

  const handleLoginAndRedirect = (personaId: ActivePersonaId) => {
    const found = PERSONA_ACCOUNTS.find((p) => p.id === personaId);
    loginAsPersona(personaId);
    setIsEzyLoginModalOpen(false);
    if (found) {
      router.push(found.defaultRoute);
    }
  };

  const handleLogoutToPublicWeb = () => {
    logout();
    setIsEzyLoginModalOpen(false);
    router.push("/");
  };

  const handleSendCopilot = (preset?: string) => {
    const q = (preset ?? copilotPrompt).trim();
    if (!q) return;

    let reply =
      "Dạ em đã ghi nhận câu hỏi. Toàn bộ thông tin tư vấn đều dựa trên Kho tri thức chính thức đã được Hội đồng Chuyên môn OYLG phê duyệt.";

    const lower = q.toLowerCase();
    if (lower.includes("lỗ hổng") || lower.includes("toán")) {
      reply = `Đối với học sinh mất gốc hoặc hổng kiến thức (như trường hợp ${activeStudent.fullName} – Lớp ${activeStudent.grade}), hệ thống tầm soát thích ứng sẽ truy ngược về đúng bài tiên quyết ở lớp dưới (ví dụ Hằng đẳng thức Lớp 8) và xếp lộ trình 60% thời lượng bù gốc + 40% bám sát bài trên lớp.`;
    } else if (lower.includes("học phí") || lower.includes("giá")) {
      reply =
        "Học phí tại All Your Life được tính minh bạch theo từng buổi dựa trên Cấp bậc chuyên gia, Khối lớp, Hình thức học (Online Zoom 1.0x · Tại Trung tâm 1.2x · Tại nhà 1.5x) và Quy mô lớp. Phụ huynh được hoàn tiền 100% các buổi chưa học trong 14 ngày đầu.";
    } else if (lower.includes("nội trú") || lower.includes("bán trú")) {
      reply =
        "Khu Nội trú & Bán trú OYLG áp dụng quy trình điểm danh 4 mốc/ngày và xác thực người đón bằng thẻ QR + đối chiếu ảnh người được ủy quyền. Phụ huynh nhận thông báo tức thì khi con đến và về.";
    }

    setCopilotMessages((prev) => [
      ...prev,
      { role: "USER", text: q },
      { role: "AI", text: reply },
    ]);
    setCopilotPrompt("");
  };

  const sharedOverlays = (
    <>
      {/* NGĂN KÉO GIỎ HÀNG & THANH TOÁN E-COMMERCE VIETQR TOÀN CỤC */}
      <EcommerceCartDrawer />

      {/* HỘP THOẠI TRỢ LÝ TƯ VẤN AI 24/7 */}
      {isAiAssistantOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-3xl bg-white border border-[#E8E5DF] shadow-2xl overflow-hidden flex flex-col">
          <div className="p-4 bg-[#141413] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold">
                  Trợ lý Tư vấn All Your Life 24/7
                </div>
                <div className="text-[10px] text-[#9E9C94]">
                  Tư vấn lộ trình 3 tầng, học phí & tầm soát năng lực
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-72 overflow-y-auto bg-[#FBF9F5] text-xs">
            {copilotMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl leading-relaxed ${
                  m.role === "AI"
                    ? "bg-white border border-[#E8E5DF] text-[#141413]"
                    : "bg-[#141413] text-white ml-8"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="px-3 py-2 bg-white border-t border-[#E8E5DF] flex flex-wrap gap-1.5">
            <button
              onClick={() =>
                handleSendCopilot("Con mất gốc Toán lớp dưới thì học thế nào?")
              }
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#FBF9F5] border border-[#E8E5DF] hover:border-[#141413] transition"
            >
              Cách bù lỗ hổng Toán?
            </button>
            <button
              onClick={() =>
                handleSendCopilot("Học phí tính thế nào và có được hoàn tiền không?")
              }
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#FBF9F5] border border-[#E8E5DF] hover:border-[#141413] transition"
            >
              Chính sách học phí?
            </button>
          </div>

          <div className="p-3 border-t border-[#E8E5DF] bg-white flex gap-2">
            <input
              type="text"
              value={copilotPrompt}
              onChange={(e) => setCopilotPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendCopilot()}
              placeholder="Nhập câu hỏi cần tư vấn..."
              className="flex-1 text-xs px-3 py-2 rounded-full border border-[#E8E5DF] focus:outline-none focus:border-[#141413]"
            />
            <button
              onClick={() => handleSendCopilot()}
              className="w-8 h-8 rounded-full bg-[#141413] text-white flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* HỘP THOẠI ĐĂNG NHẬP & CHUYỂN ĐỔI VAI TRÒ HỆ THỐNG ALL YOUR LIFE */}
      {isEzyLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E5DF] shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 bg-[#141413] text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#9E9C94] font-semibold">
                  Cổng Xác Thực Thành Viên & Chuyển Vai Trò
                </div>
                <h3 className="text-lg font-bold mt-0.5">
                  Đăng nhập Hệ thống All Your Life
                </h3>
              </div>
              <button
                onClick={() => setIsEzyLoginModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLoginAndRedirect("PARENT_LAN");
                }}
                className="space-y-3 pb-5 border-b border-[#E8E5DF]"
              >
                <div className="text-xs font-bold text-[#141413]">
                  Đăng nhập bằng Số điện thoại / Email đã đăng ký
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <input
                    type="text"
                    value={loginPhoneInput}
                    onChange={(e) => setLoginPhoneInput(e.target.value)}
                    placeholder="Số điện thoại hoặc Email..."
                    className="px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FBF9F5]"
                  />
                  <input
                    type="password"
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    placeholder="Mật khẩu..."
                    className="px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FBF9F5]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#141413] hover:bg-[#292826] text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Đăng nhập vào Cổng Phụ huynh</span>
                </button>
              </form>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141413]">
                    Chọn nhanh Tài khoản theo Vai trò để kiểm thử:
                  </span>
                  {isLoggedIn && (
                    <button
                      onClick={handleLogoutToPublicWeb}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Đăng xuất về Website
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {PERSONA_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => handleLoginAndRedirect(acc.id)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-[#E8E5DF] hover:border-[#141413] bg-[#FBF9F5] hover:bg-white text-left transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0`}
                        >
                          {acc.avatarInitials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#141413] truncate">
                            {acc.fullName}
                          </div>
                          <div className="text-[11px] text-[#575653] truncate">
                            {acc.roleTitle}
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-black/5 group-hover:bg-[#141413] group-hover:text-white text-[10px] font-semibold transition shrink-0">
                        Mở {acc.roleCode} →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ============================================================================
  // 1. GIAO DIỆN HỆ THỐNG QUẢN TRỊ DOANH NGHIỆP (/admin, /studio, /operations/*)
  // ============================================================================
  if (isEnterpriseAdminRoute) {
    return (
      <div className="min-h-screen flex bg-[#F4F5F7] text-[#141413]">
        <aside className="w-68 shrink-0 bg-[#141413] text-[#D4D2CC] flex flex-col justify-between border-r border-white/10 hidden lg:flex">
          <div>
            <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FBF9F5] text-[#141413] flex items-center justify-center font-black text-xs">
                  OY
                </div>
                <div>
                  <div className="text-sm font-bold text-white leading-none">
                    OYLG Enterprise
                  </div>
                  <div className="text-[11px] text-[#8E8C84] mt-1">
                    Hệ thống Quản trị Doanh nghiệp
                  </div>
                </div>
              </Link>
            </div>

            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${displayPersona.avatarBg} text-white flex items-center justify-center text-xs font-bold`}
              >
                {displayPersona.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {displayPersona.fullName}
                </div>
                <div className="text-[11px] text-emerald-400 truncate">
                  Đang trực: {displayPersona.roleCode}
                </div>
              </div>
            </div>

            <nav className="p-3 space-y-5 text-xs overflow-y-auto max-h-[calc(100vh-220px)]">
              <div>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8C84]">
                  ĐIỀU HÀNH TRUNG TÂM
                </div>
                <Link
                  href="/admin"
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    pathname === "/admin" || pathname === "/ezyadmin"
                      ? "bg-white text-[#141413] font-bold"
                      : "hover:bg-white/5 text-[#D4D2CC]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Gauge className="w-4 h-4" />
                    <span>Tổng quan Vận hành & Bảng giá</span>
                  </span>
                </Link>
              </div>

              <div>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8C84]">
                  NGHIỆP VỤ CHUYÊN MÔN & VẬN HÀNH
                </div>
                <div className="space-y-1">
                  <Link
                    href="/studio"
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                      pathname === "/studio"
                        ? "bg-white text-[#141413] font-bold"
                        : "hover:bg-white/5 text-[#D4D2CC]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpenCheck className="w-4 h-4" />
                      <span>Phê duyệt Học liệu & Đề AI</span>
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        pathname === "/studio"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-amber-400/20 text-amber-300"
                      }`}
                    >
                      {pendingApprovalsCount} chờ duyệt
                    </span>
                  </Link>

                  <Link
                    href="/operations/sales"
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                      pathname === "/operations/sales"
                        ? "bg-white text-[#141413] font-bold"
                        : "hover:bg-white/5 text-[#D4D2CC]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BadgePercent className="w-4 h-4" />
                      <span>Đơn hàng E-Com, POS & Hoa hồng</span>
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        pathname === "/operations/sales"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-emerald-400/20 text-emerald-300"
                      }`}
                    >
                      {orders.length} đơn
                    </span>
                  </Link>

                  <Link
                    href="/operations/boarding"
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                      pathname === "/operations/boarding"
                        ? "bg-white text-[#141413] font-bold"
                        : "hover:bg-white/5 text-[#D4D2CC]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4" />
                      <span>Quản lý Nội trú & Đón trả QR</span>
                    </span>
                  </Link>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8C84]">
                  QUẢN TRỊ NỘI DUNG WEBSITE (CMS)
                </div>
                <Link
                  href="/ezyadmin/page-fragments"
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    pathname === "/ezyadmin/page-fragments"
                      ? "bg-white text-[#141413] font-bold"
                      : "hover:bg-white/5 text-[#D4D2CC]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Puzzle className="w-4 h-4 text-amber-400" />
                    <span>Chỉnh sửa Nội dung Trang chủ</span>
                  </span>
                </Link>
              </div>
            </nav>
          </div>

          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Xem Website Công Khai</span>
            </Link>
            <button
              onClick={handleLogoutToPublicWeb}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất Quản trị</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <span className="whitespace-nowrap truncate px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold">
                {enterprisePageTitle}
              </span>
                          </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/"
                className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website Công Khai</span>
              </Link>

              <button
                onClick={() => setIsEzyLoginModalOpen(true)}
                className="whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800"
              >
                <span
                  className={`w-5 h-5 rounded-full ${displayPersona.avatarBg} text-white flex items-center justify-center text-[10px] font-bold`}
                >
                  {displayPersona.avatarInitials}
                </span>
                <span className="hidden sm:inline">{displayPersona.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </header>
              <nav className="lg:hidden sticky top-16 z-20 bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1 text-xs whitespace-nowrap overflow-x-auto">
                {[
                  { href: "/admin", label: "Điều hành" },
                  { href: "/studio", label: `Học liệu (${pendingApprovalsCount})` },
                  { href: "/operations/sales", label: `Đơn hàng (${orders.length})` },
                  { href: "/operations/boarding", label: "Nội trú" },
                  { href: "/ezyadmin/page-fragments", label: "CMS" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-semibold ${
                      pathname === item.href
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>


          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
        </div>
        {sharedOverlays}
      </div>
    );
  }

  // ============================================================================
  // 2. GIAO DIỆN CỔNG THÀNH VIÊN SAU KHI ĐĂNG NHẬP (/parent, /student, /coach)
  // ============================================================================
  if (!isPublicWebsiteRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#141413]">
        <header className="bg-white/95 backdrop-blur-md border-b border-[#E8E5DF] sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-[#141413] text-[#FBF9F5] flex items-center justify-center font-bold text-sm">
                  OY
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-[#141413] leading-none whitespace-nowrap">
                    All Your Life
                  </div>
                  <div className="text-[11px] text-[#575653] mt-0.5 whitespace-nowrap">
                    {isParentPortal
                      ? "Cổng Phụ huynh"
                      : isStudentPortal
                      ? "Không gian Học sinh"
                      : "Không gian Cố vấn"}
                  </div>
                </div>
              </Link>

              {pathname.startsWith("/coach") && (
                <div className="hidden md:flex items-center gap-1 pl-4 border-l border-[#E8E5DF]">
                  <Link
                    href="/coach"
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      pathname === "/coach"
                        ? "bg-[#141413] text-white"
                        : "text-[#575653] hover:bg-black/5"
                    }`}
                  >
                    Hồ sơ &amp; Bản đồ nhiệt
                  </Link>
                  <Link
                    href="/coach/sessions"
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      pathname === "/coach/sessions"
                        ? "bg-[#141413] text-white"
                        : "text-[#575653] hover:bg-black/5"
                    }`}
                  >
                    Sổ đầu bài
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Chọn hồ sơ: Phụ huynh chọn con, Cố vấn chọn học sinh phụ trách. Học sinh không thấy hồ sơ người khác. */}
              {!isStudentPortal && (
                <div className="hidden sm:flex items-center gap-1.5 bg-[#FBF9F5] px-3 py-1.5 rounded-full border border-[#E8E5DF]">
                  <span className="text-[11px] text-[#575653] whitespace-nowrap">
                    {isParentPortal ? "Con:" : "Học sinh:"}
                  </span>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#141413] focus:outline-none cursor-pointer max-w-[190px] truncate"
                  >
                    {studentCases.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} · Lớp {st.grade}
                        {isParentPortal ? ` · Ví ${st.sessionCreditsRemaining} buổi` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Giỏ gói học chỉ dành cho Phụ huynh (người thanh toán) */}
              {isParentPortal && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#112A22] hover:bg-emerald-950 text-[#FBF9F5] text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden md:inline">Giỏ gói học</span>
                  <span className="px-1.5 rounded-full bg-white/15 text-[10px] font-mono font-bold">
                    {cartTotalCount}
                  </span>
                </button>
              )}

              <button
                onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
                title="Trợ lý AI"
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-emerald-950/5 hover:bg-emerald-950/10 text-emerald-900 border border-emerald-900/15 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden xl:inline">Trợ lý AI</span>
              </button>

              <button
                onClick={() => setIsEzyLoginModalOpen(true)}
                className="whitespace-nowrap flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[#E8E5DF] bg-white hover:bg-[#FBF9F5] text-xs font-semibold"
              >
                <span
                  className={`w-6 h-6 rounded-full ${displayPersona.avatarBg} text-white flex items-center justify-center text-[10px] font-bold`}
                >
                  {displayPersona.avatarInitials}
                </span>
                <span className="hidden lg:inline">{displayPersona.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#575653]" />
              </button>

              <button
                onClick={handleLogoutToPublicWeb}
                title="Đăng xuất về Website công khai"
                className="p-2 rounded-full border border-[#E8E5DF] hover:bg-rose-50 text-[#575653] hover:text-rose-700 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        {sharedOverlays}
      </div>
    );
  }

  // ============================================================================
  // 3. GIAO DIỆN WEBSITE PUBLIC CHUẨN HALLMARK / OPEN DESIGN (ĐẦY ĐỦ MÀU SẮC & KHÔNG RỚT DÒNG)
  // ============================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#141413] overflow-x-hidden relative">
      {/* Ambient Colorful Background Glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-amber-200/40 via-orange-200/30 to-rose-200/20 blur-3xl" />
        <div className="absolute top-20 -right-24 w-[460px] h-[460px] rounded-full bg-gradient-to-bl from-emerald-200/35 via-teal-200/25 to-cyan-200/20 blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-200/25 via-sky-200/20 to-amber-100/20 blur-3xl" />
      </div>

      {/* FLOATING GLASS ISLAND NAVBAR — WIDER CONTAINER & ZERO LINE WRAPPING */}
      <div className="sticky top-4 z-40 px-3 sm:px-6">
        <header className="max-w-7xl mx-auto rounded-full bg-white/95 backdrop-blur-xl border border-amber-200/70 shadow-[0_12px_36px_rgb(232,93,63,0.08)] px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl btn-oylg-primary text-white flex items-center justify-center font-extrabold text-xs tracking-wider shadow-sm shrink-0">
              OYLG
            </div>
            <div className="shrink-0">
              <div className="text-sm font-extrabold text-[#141413] tracking-tight leading-none whitespace-nowrap">
                All Your Life
              </div>
              <div className="text-[11px] font-medium text-stone-500 mt-0.5 whitespace-nowrap">
                Hướng nghiệp & Đồng hành
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs font-bold text-stone-700 shrink-0">
            <a
              href="/#lo-trinh-3-tang"
              className="whitespace-nowrap shrink-0 px-3.5 py-2 rounded-full hover:bg-amber-50 hover:text-[#E85D3F] transition"
            >
              Mô hình 3 Tầng
            </a>
            <a
              href="/#bang-gia-goi-hoc"
              className="whitespace-nowrap shrink-0 px-3.5 py-2 rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              Gói Học & Học Phí
            </a>
            <a
              href="/#doi-ngu-chuyen-gia"
              className="whitespace-nowrap shrink-0 px-3.5 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              Hội Đồng Chuyên Gia
            </a>
            <a
              href="/#noi-tru-an-toan"
              className="whitespace-nowrap shrink-0 px-3.5 py-2 rounded-full hover:bg-sky-50 hover:text-sky-700 transition"
            >
              Nội Trú & Bán Trú
            </a>
            <a
              href="/#dang-ky-tu-van"
              className="whitespace-nowrap shrink-0 px-3.5 py-2 rounded-full hover:bg-rose-50 hover:text-rose-700 transition"
            >
              Đặt Lịch Tư Vấn
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Nút Giỏ Gói Học E-Commerce trên Website Public */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-xs font-bold text-emerald-950 transition shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Giỏ gói học</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-mono leading-none">
                {cartTotalCount}
              </span>
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => setIsEzyLoginModalOpen(true)}
                className="btn-oylg-primary whitespace-nowrap shrink-0 group inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-[#E85D3F] text-white text-xs font-bold transition shadow-sm active:scale-[0.98]"
              >
                <span className="whitespace-nowrap">Đăng nhập</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5 shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={currentPersona.defaultRoute}
                  className="btn-oylg-emerald whitespace-nowrap shrink-0 group inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                >
                  <span className="whitespace-nowrap">Vào {currentPersona.portalName}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
                <button
                  onClick={() => setIsEzyLoginModalOpen(true)}
                  title="Đổi tài khoản hoặc Đăng xuất"
                  className={`w-8 h-8 rounded-full ${currentPersona.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0`}
                >
                  {currentPersona.avatarInitials}
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* MAIN PUBLIC WEBSITE CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        {children}
      </main>

      {/* GỌN GÀNG, TINH TẾ & ĐÚNG TRỌNG TÂM GIÁO DỤC */}
      <footer className="bg-[#141413] text-[#D4D2CC] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl btn-oylg-primary text-white flex items-center justify-center font-extrabold text-xs">
                  OYLG
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  All Your Life
                </span>
              </div>
              <p className="text-xs text-[#A8A69E] leading-relaxed max-w-md">
                Đồng hành Hướng nghiệp, Cố vấn Cuộc sống và Gia sư 1-1 bù lỗ
                hổng kiến thức cho học sinh Lớp 1–12.
              </p>
              <div className="text-xs text-emerald-400 font-semibold">
                Hotline: 1900 636 888 · TP. Buôn Ma Thuột, Đắk Lắk
              </div>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                Chương trình
              </div>
              <ul className="space-y-2 text-xs text-[#A8A69E]">
                <li>
                  <a href="/#lo-trinh-3-tang" className="hover:text-white transition">
                    Mô hình 3 Tầng
                  </a>
                </li>
                <li>
                  <a href="/#bang-gia-goi-hoc" className="hover:text-white transition">
                    Gói học & Học phí
                  </a>
                </li>
                <li>
                  <a href="/#doi-ngu-chuyen-gia" className="hover:text-white transition">
                    Hội đồng Chuyên gia
                  </a>
                </li>
                <li>
                  <a href="/#noi-tru-an-toan" className="hover:text-white transition">
                    Nội trú & Bán trú
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                Dành cho Gia đình
              </div>
              <ul className="space-y-2 text-xs text-[#A8A69E]">
                <li>
                  <a href="/#dang-ky-tu-van" className="hover:text-white transition">
                    Đặt lịch tư vấn 1-1
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="hover:text-white transition"
                  >
                    Giỏ gói học
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsEzyLoginModalOpen(true)}
                    className="hover:text-white transition"
                  >
                    Đăng nhập thành viên
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8E8C84]">
            <div>
              &copy; {new Date().getFullYear()} Công ty TNHH All Your Life.
            </div>
            <div>Hoàn học phí 100% số buổi chưa học trong 14 ngày đầu.</div>
          </div>
        </div>
      </footer>

      {/* NÚT TRỢ LÝ TƯ VẤN NỔI GÓC DƯỚI PHẢI */}
      {!isAiAssistantOpen && (
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 pl-4 pr-2 py-2 rounded-full bg-[#141413] text-[#FBF9F5] shadow-xl border border-white/15 text-xs font-semibold hover:scale-[1.02] transition"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Hỏi Trợ lý Tư vấn OYLG 24/7</span>
          <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[10px]">
            AI
          </span>
        </button>
      )}

      {sharedOverlays}
    </div>
  );
}
