package com.allyourlife.oylg.web.controller.view;

import com.allyourlife.oylg.entity.OylgExpertProfile;
import com.allyourlife.oylg.entity.OylgLearningCase;
import com.allyourlife.oylg.entity.OylgStudentProfile;
import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.service.OylgPricingService;
import com.tvd12.ezyhttp.core.response.ResponseEntity;
import com.tvd12.ezyhttp.server.core.annotation.Controller;
import com.tvd12.ezyhttp.server.core.annotation.DoGet;
import com.tvd12.ezyhttp.server.core.annotation.PathVariable;
import com.tvd12.ezyhttp.server.core.annotation.RequestParam;
import com.tvd12.ezyhttp.server.core.view.Redirect;
import com.tvd12.ezyhttp.server.core.view.View;

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

    public OylgWebViewController(
        OylgPricingService pricingService,
        OylgPlatformService platformService
    ) {
        this.pricingService = pricingService;
        this.platformService = platformService;
    }

    @DoGet("/")
    public View homeGet() {
        return baseView("home", "public", "home", "page_title.home")
            .addVariable("featuredPackages", platformService.getFeaturedHomePackages())
            .addVariable("allPackages", platformService.getActivePackages())
            .addVariable("experts", platformService.getAllExperts())
            .addVariable("heatmapUnits", platformService.getStudentHeatmapView(1L))
            .build();
    }

    @DoGet("/pages/{slug}")
    public Object pageSlugGet(@PathVariable("slug") String slug) {
        if (SECTION_REDIRECTS.containsKey(slug)) {
            return Redirect.to(SECTION_REDIRECTS.get(slug));
        }
        OylgExpertProfile expert = platformService.getExpertBySlugOrDefault(slug);
        return baseView("member-landing", "public", "experts", "page_title.home")
            .addVariable("expert", expert)
            .addVariable("experts", platformService.getAllExperts())
            .addVariable("featuredPackages", platformService.getFeaturedHomePackages())
            .build();
    }

    @DoGet("/parent")
    public View parentGet(@RequestParam(value = "studentId", defaultValue = "1") long studentId) {
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        long sid = activeStudent != null ? activeStudent.getId() : 1L;
        OylgLearningCase activeCase = platformService.getCaseForStudent(sid);
        return baseView("parent/portal", "member", "parent", "page_title.parent_portal")
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
            .addVariable("allPackages", platformService.getActivePackages())
            .build();
    }

    @DoGet("/student")
    public View studentGet(
        @RequestParam(value = "studentId", defaultValue = "1") long studentId,
        @RequestParam(value = "mode", defaultValue = "") String mode
    ) {
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        long sid = activeStudent != null ? activeStudent.getId() : 1L;
        boolean primaryMode = "primary".equalsIgnoreCase(mode)
            || (mode.isEmpty() && activeStudent != null && activeStudent.getCurrentGrade() <= 5);
        return baseView("student/workspace", "member", "student", "page_title.student_workspace")
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
    public View coachGet(@RequestParam(value = "studentId", defaultValue = "1") long studentId) {
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        long sid = activeStudent != null ? activeStudent.getId() : 1L;
        return baseView("coach/control-tower", "app", "coach", "page_title.expert_workspace")
            .addVariable("personaName", "ThS. Lê Minh Tâm")
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
    public View coachSessionsGet(@RequestParam(value = "studentId", defaultValue = "1") long studentId) {
        OylgStudentProfile activeStudent = platformService.getStudentOrDefault(studentId);
        return baseView("coach/sessions", "app", "coach_sessions", "page_title.expert_workspace")
            .addVariable("personaName", "Thầy Đặng Quốc Việt")
            .addVariable("personaRole", "Trưởng Bộ môn Toán")
            .addVariable("personaInitials", "QV")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("activeStudent", activeStudent)
            .addVariable("scheduledLessons", platformService.getScheduledLessons(null))
            .addVariable("completedLogs", platformService.getCompletedLessonLogs(null))
            .build();
    }

    @DoGet("/operations/sales")
    public View salesGet() {
        return baseView("operations/sales", "app", "sales", "page_title.expert_workspace")
            .addVariable("personaName", "Phạm Hoàng Minh")
            .addVariable("personaRole", "Trưởng nhóm Tuyển sinh")
            .addVariable("personaInitials", "HM")
            .addVariable("leads", platformService.getAllLeads())
            .addVariable("orders", platformService.getOrders(null))
            .addVariable("allPackages", platformService.getActivePackages())
            .build();
    }

    @DoGet("/operations/boarding")
    public View boardingGet() {
        return baseView("operations/boarding", "app", "boarding", "page_title.parent_portal")
            .addVariable("personaName", "Thầy Vũ Hải Nam")
            .addVariable("personaRole", "Quản sinh Nội trú")
            .addVariable("personaInitials", "HN")
            .addVariable("residencies", platformService.getAllResidencies())
            .addVariable("pickups", platformService.getPickupsForStudent(1L))
            .addVariable("checkins", platformService.getRecentCheckins(null))
            .build();
    }

    @DoGet("/studio")
    public View studioGet() {
        return baseView("admin/studio", "app", "studio", "page_title.expert_workspace")
            .addVariable("personaName", "Cố vấn Tracie Anh")
            .addVariable("personaRole", "Chủ tịch Hội đồng Chuyên môn")
            .addVariable("personaInitials", "TA")
            .addVariable("questions", platformService.getAllQuestions())
            .build();
    }

    @DoGet("/admin")
    public View adminGet() {
        return baseView("admin/executive", "app", "admin", "page_title.home")
            .addVariable("personaName", "Ban Điều Hành OYLG")
            .addVariable("personaRole", "Quản trị Hệ thống")
            .addVariable("personaInitials", "AD")
            .addVariable("students", platformService.getAllStudents())
            .addVariable("cases", platformService.getAllCases())
            .addVariable("orders", platformService.getOrders(null))
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

    private View.Builder baseView(
        String template,
        String shellMode,
        String activeNav,
        String pageTitleKey
    ) {
        return View.builder()
            .template(template)
            .addVariable("shellMode", shellMode)
            .addVariable("activeNav", activeNav)
            .addVariable("pageTitle", pageTitleKey)
            .addVariable("baseSessionPrice", pricingService.getBaseSessionPrice())
            .addVariable("pendingQuestionCount", platformService.getAllQuestions().size())
            .addVariable("totalOrderCount", platformService.getOrders(null).size());
    }
}
