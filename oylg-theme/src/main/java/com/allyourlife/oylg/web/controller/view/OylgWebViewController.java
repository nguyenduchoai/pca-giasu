package com.allyourlife.oylg.web.controller.view;

import com.allyourlife.oylg.entity.OylgExpertProfile;
import com.allyourlife.oylg.entity.OylgLearningCase;
import com.allyourlife.oylg.entity.OylgPortalAccount;
import com.allyourlife.oylg.entity.OylgStudentProfile;
import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.allyourlife.oylg.service.OylgSecurityAndLedgerService;
import com.tvd12.ezyhttp.core.response.ResponseEntity;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.annotation.PathVariable;
import com.tvd12.ezyhttp.server.core.annotation.RequestParam;
import com.tvd12.ezyhttp.server.core.view.Redirect;
import com.tvd12.ezyhttp.server.core.view.View;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
public class OylgWebViewController {

    private static final Map<String, String> SECTION_REDIRECTS = new HashMap<>();

    static {
        SECTION_REDIRECTS.put("mo-hinh-3-tang", "/#mo-hinh-3-tang");
        SECTION_REDIRECTS.put("bang-gia", "/#bang-gia-goi-hoc");
        SECTION_REDIRECTS.put("goi-hoc", "/#bang-gia-goi-hoc");
        SECTION_REDIRECTS.put("chuyen-gia", "/#hoi-dong-chuyen-gia");
        SECTION_REDIRECTS.put("doi-ngu-chuyen-gia", "/#hoi-dong-chuyen-gia");
        SECTION_REDIRECTS.put("noi-tru", "/#noi-tru-an-toan");
        SECTION_REDIRECTS.put("dat-lich-tu-van", "/#dat-lich-tu-van");
    }

    private final OylgPricingService pricingService;
    private final OylgPlatformService platformService;
    private final OylgSecurityAndLedgerService securityAndLedgerService;

    public OylgWebViewController(
        OylgPricingService pricingService,
        OylgPlatformService platformService,
        OylgSecurityAndLedgerService securityAndLedgerService
    ) {
        this.pricingService = pricingService;
        this.platformService = platformService;
        this.securityAndLedgerService = securityAndLedgerService;
    }

    @DoGet("/")
    public View homeGet(HttpServletRequest request) {
        return baseView(request, "home", "public", "home", "page_title.home")
            .addVariable("featuredPackages", platformService.getFeaturedHomePackages())
            .addVariable("allPackages", platformService.getActivePackages())
            .addVariable("experts", platformService.getAllExperts())
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(1L))
            .build();
    }

    @DoGet("/login")
    public View loginGet(
        HttpServletRequest request,
        @RequestParam(value = "redirect", defaultValue = "/parent") String redirect,
        @RequestParam(value = "denied", defaultValue = "0") int denied
    ) {
        return baseView(request, "login", "public", "login", "page_title.home")
            .addVariable("redirectUri", redirect)
            .addVariable("accessDenied", denied == 1)
            .addVariable("portalAccounts", securityAndLedgerService.getAllPortalAccounts())
            .build();
    }

    @DoGet("/pages/{slug}")
    public Object pageSlugGet(HttpServletRequest request, @PathVariable("slug") String slug) {
        if (SECTION_REDIRECTS.containsKey(slug)) {
            return Redirect.to(SECTION_REDIRECTS.get(slug));
        }
        OylgExpertProfile expert = platformService.getExpertBySlugOrDefault(slug);
        return baseView(request, "member-landing", "public", "experts", "page_title.home")
            .addVariable("expert", expert)
            .addVariable("experts", platformService.getAllExperts())
            .addVariable("featuredPackages", platformService.getFeaturedHomePackages())
            .build();
    }

    @DoGet("/parent")
    public Object parentGet(
        HttpServletRequest request,
        @RequestParam(value = "studentId", defaultValue = "1") long studentId
    ) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "parent")) {
            return Redirect.to("/login?denied=1&redirect=/parent");
        }
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        long sid = activeStudent != null ? activeStudent.getId() : 1L;
        OylgLearningCase activeCase = platformService.getCaseForStudent(sid);
        return baseView(request, "parent/portal", "member", "parent", "page_title.parent_portal")
            .addVariable("personaName", activeStudent != null ? activeStudent.getParentName() : "Chị Nguyễn Thị Lan")
            .addVariable("personaRole", "Phụ huynh đồng hành")
            .addVariable("personaInitials", "PH")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("activeStudent", activeStudent)
            .addVariable("activeCase", activeCase)
            .addVariable("scheduledLessons", platformService.getScheduledLessons(sid))
            .addVariable("completedLogs", platformService.getCompletedLessonLogs(sid))
            .addVariable("boardingCheckins", platformService.getRecentCheckins(sid))
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("walletLedger", securityAndLedgerService.getWalletLedger(sid))
            .addVariable("liveTotpMap", securityAndLedgerService.getLivePickupTotpMap(sid))
            .addVariable("pickups", platformService.getPickupsForStudent(sid))
            .addVariable("allPackages", platformService.getActivePackages())
            .build();
    }

    @DoGet("/student")
    public Object studentGet(
        HttpServletRequest request,
        @RequestParam(value = "studentId", defaultValue = "1") long studentId,
        @RequestParam(value = "mode", defaultValue = "") String mode
    ) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "student")) {
            return Redirect.to("/login?denied=1&redirect=/student");
        }
        long effectiveStudentId = (acc != null && "STUDENT".equals(acc.getRoleCode()) && acc.getLinkedStudentId() > 0)
            ? acc.getLinkedStudentId()
            : studentId;
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(effectiveStudentId);
        long sid = activeStudent != null ? activeStudent.getId() : 1L;
        boolean primaryMode = "primary".equalsIgnoreCase(mode)
            || (mode.isEmpty() && activeStudent != null && activeStudent.getCurrentGrade() <= 5);
        return baseView(request, "student/workspace", "member", "student", "page_title.student_workspace")
            .addVariable("personaName", activeStudent != null ? activeStudent.getFullName() : "Nguyễn Minh Khôi")
            .addVariable("personaRole", "Học sinh Lớp " + (activeStudent != null ? activeStudent.getCurrentGrade() : 9))
            .addVariable("personaInitials", "HS")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("activeStudent", activeStudent)
            .addVariable("primaryMode", primaryMode)
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(sid))
            .build();
    }

    @DoGet("/coach")
    public Object coachGet(
        HttpServletRequest request,
        @RequestParam(value = "studentId", defaultValue = "1") long studentId
    ) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "coach")) {
            return Redirect.to("/login?denied=1&redirect=/coach");
        }
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        long sid = activeStudent != null ? activeStudent.getId() : 1L;
        return baseView(request, "coach/control-tower", "app", "coach", "page_title.expert_workspace")
            .addVariable("personaName", acc != null ? acc.getFullName() : "ThS. Lê Minh Tâm")
            .addVariable("personaRole", "Cố vấn Cuộc sống")
            .addVariable("personaInitials", "MT")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("cases", platformService.getAllCases())
            .addVariable("activeStudent", activeStudent)
            .addVariable("activeCase", platformService.getCaseForStudent(sid))
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(sid))
            .addVariable("safetyFlags", platformService.getAllSafetyFlags())
            .build();
    }

    @DoGet("/coach/sessions")
    public Object coachSessionsGet(
        HttpServletRequest request,
        @RequestParam(value = "studentId", defaultValue = "1") long studentId
    ) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "coach")) {
            return Redirect.to("/login?denied=1&redirect=/coach/sessions");
        }
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        return baseView(request, "coach/sessions", "app", "coach_sessions", "page_title.expert_workspace")
            .addVariable("personaName", acc != null ? acc.getFullName() : "Thầy Đặng Quốc Việt")
            .addVariable("personaRole", "Trưởng Bộ môn Toán")
            .addVariable("personaInitials", "QV")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("activeStudent", activeStudent)
            .addVariable("scheduledLessons", platformService.getScheduledLessons(null))
            .addVariable("completedLogs", platformService.getCompletedLessonLogs(null))
            .build();
    }

    @DoGet("/operations/sales")
    public Object salesGet(HttpServletRequest request) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "sales")) {
            return Redirect.to("/login?denied=1&redirect=/operations/sales");
        }
        return baseView(request, "operations/sales", "app", "sales", "page_title.expert_workspace")
            .addVariable("personaName", acc != null ? acc.getFullName() : "Phạm Hoàng Minh")
            .addVariable("personaRole", "Trưởng nhóm Tuyển sinh")
            .addVariable("personaInitials", "HM")
            .addVariable("leads", platformService.getAllLeads())
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("allPackages", platformService.getActivePackages())
            .build();
    }

    @DoGet("/operations/boarding")
    public Object boardingGet(HttpServletRequest request) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "boarding")) {
            return Redirect.to("/login?denied=1&redirect=/operations/boarding");
        }
        return baseView(request, "operations/boarding", "app", "boarding", "page_title.parent_portal")
            .addVariable("personaName", acc != null ? acc.getFullName() : "Thầy Vũ Hải Nam")
            .addVariable("personaRole", "Quản sinh Nội trú")
            .addVariable("personaInitials", "HN")
            .addVariable("residencies", platformService.getAllResidencies())
            .addVariable("pickups", platformService.getPickupsForStudent(1L))
            .addVariable("liveTotpMap", securityAndLedgerService.getLivePickupTotpMap(1L))
            .addVariable("checkins", platformService.getRecentCheckins(null))
            .build();
    }

    @DoGet("/studio")
    public Object studioGet(HttpServletRequest request) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !securityAndLedgerService.canAccessPortal(acc, "studio")) {
            return Redirect.to("/login?denied=1&redirect=/studio");
        }
        return baseView(request, "admin/studio", "app", "studio", "page_title.expert_workspace")
            .addVariable("personaName", acc != null ? acc.getFullName() : "Cố vấn Tracie Anh")
            .addVariable("personaRole", "Chủ tịch Hội đồng Chuyên môn")
            .addVariable("personaInitials", "TA")
            .addVariable("questions", platformService.getAllQuestions())
            .build();
    }

    @DoGet("/admin")
    public Object adminGet(HttpServletRequest request) {
        OylgPortalAccount acc = resolveSessionAccount(request);
        if (acc != null && !"ADMIN".equals(acc.getRoleCode())) {
            return Redirect.to("/login?denied=1&redirect=/admin");
        }
        return baseView(request, "admin/executive", "app", "admin", "page_title.home")
            .addVariable("personaName", "Ban Điều Hành OYLG")
            .addVariable("personaRole", "Trung tâm Điều hành Hệ thống")
            .addVariable("personaInitials", "AD")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("cases", platformService.getAllCases())
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("walletLedger", securityAndLedgerService.getWalletLedger(null))
            .addVariable("digestLogs", securityAndLedgerService.getDigestDispatches())
            .addVariable("groupClasses", platformService.getAllGroupClasses())
            .addVariable("safetyFlags", platformService.getAllSafetyFlags())
            .addVariable("questions", platformService.getAllQuestions())
            .build();
    }

    @DoGet("/health")
    public ResponseEntity healthGet() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("platform", "EzyPlatform 1.5.6 Native OYLG");
        return ResponseEntity.ok(status);
    }

    private OylgPortalAccount resolveSessionAccount(HttpServletRequest request) {
        if (request == null || request.getCookies() == null) {
            return null;
        }
        for (Cookie c : request.getCookies()) {
            if (OylgSecurityAndLedgerService.SESSION_COOKIE_NAME.equals(c.getName())) {
                return securityAndLedgerService.getAccountByToken(c.getValue());
            }
        }
        return null;
    }

    private View.Builder baseView(
        HttpServletRequest request,
        String template,
        String shellMode,
        String activeNav,
        String pageTitleKey
    ) {
        OylgPortalAccount loggedAccount = resolveSessionAccount(request);
        return View.builder()
            .template(template)
            .addVariable("shellMode", shellMode)
            .addVariable("activeNav", activeNav)
            .addVariable("pageTitle", pageTitleKey)
            .addVariable("loggedAccount", loggedAccount)
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .addVariable("pendingQuestionCount", platformService.getAllQuestions().size())
            .addVariable("totalOrderCount", platformService.getOrders(null).size());
    }
}
