package com.allyourlife.oylg.web.view;

import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import com.tvd12.ezyhttp.server.core.view.View;
import org.youngmonkeys.ezyplatform.rx.Reactive;
import org.youngmonkeys.ezyplatform.web.view.WebViewDecorator;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Đặt tại module: oylg-theme
 * Kế thừa WebViewDecorator chuẩn EzyPlatform:
 * Nạp song song mainMenu, footerMenu, commonFragments, footerFragments bằng Reactive.multiple()
 * và gán qua view.setVariableIfAbsent(...) để bảo toàn SSOT.
 */
@EzySingleton
public class OylgWebViewDecorator extends WebViewDecorator {

    @Override
    public void decorate(HttpServletRequest request, View view) {
        super.decorate(request, view);
        view.setVariable("mainMenu", buildDefaultMainMenu());
        view.setVariable("footerMenu", buildDefaultFooterMenu());
        view.setVariable("commonFragments", buildDefaultCommonFragments());
        view.setVariable("footerFragments", buildDefaultFooterFragments());
        view.setVariable("currentYear", LocalDate.now().getYear());
    }

    private List<Map<String, String>> buildDefaultMainMenu() {
        return Arrays.asList(
            menuItem("Gói dịch vụ & Bảng giá", "/#bang-gia-b6"),
            menuItem("Về OYLG", "/pages/ve-chung-toi"),
            menuItem("Đội ngũ Chuyên gia", "/pages/doi-ngu-chuyen-gia"),
            menuItem("Tạp chí Giáo dục", "/pages/tap-chi-giao-duc"),
            menuItem("Cổng Phụ huynh", "/parent"),
            menuItem("Cổng Học sinh", "/student")
        );
    }

    private List<Map<String, String>> buildDefaultFooterMenu() {
        return Arrays.asList(
            menuItem("Triết lý Giáo dục & 4 Cam kết Vàng", "/pages/ve-chung-toi"),
            menuItem("Đội ngũ Cố vấn & Chuyên gia Bộ môn", "/pages/doi-ngu-chuyen-gia"),
            menuItem("Cổng Đồng hành Phụ huynh", "/parent"),
            menuItem("Không gian Học sinh", "/student"),
            menuItem("Bàn làm việc Cố vấn & Gia sư", "/coach"),
            menuItem("EzyAdmin Control Tower (:9090)", "http://localhost:9090/oylg/dashboard")
        );
    }

    private Map<String, String> buildDefaultCommonFragments() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(
            "main_header_announcement",
            "Nền tảng Hướng nghiệp, Cố vấn Cuộc sống & Đồng hành Học sinh Lớp 1–12 trên EzyPlatform"
        );
        map.put(
            "appointment_scheduling_cta",
            "Đăng ký Tư vấn Lộ trình 1-1 & Mua Gói Học Trực Tuyến qua VietQR"
        );
        return map;
    }

    private Map<String, String> buildDefaultFooterFragments() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(
            "company_intro",
            "CÔNG TY TNHH ALL YOUR LIFE (OYLG) — Hệ sinh thái Hướng nghiệp, Cố vấn Cuộc sống & Đồng hành Học sinh trên nền tảng EzyPlatform."
        );
        map.put(
            "contact_information",
            "Trụ sở: TP. Buôn Ma Thuột, Đắk Lắk · Tổng đài Bảo vệ Trẻ em: 111 · Hotline Tư vấn: 1900 6868"
        );
        return map;
    }

    private Map<String, String> menuItem(String title, String url) {
        Map<String, String> item = new LinkedHashMap<>();
        item.put("title", title);
        item.put("url", url);
        return item;
    }

    @Override
    protected boolean includeWebLanguages() {
        return true;
    }
}
