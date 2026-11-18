package com.allyourlife.oylg.web.view;

import com.allyourlife.oylg.service.OylgPlatformService;
import com.tvd12.ezyfox.bean.annotation.EzyAutoBind;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;
import com.tvd12.ezyhttp.server.core.view.View;
import org.youngmonkeys.ezyplatform.web.view.WebViewDecorator;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@EzySingleton
public class OylgWebViewDecorator extends WebViewDecorator {

    @EzyAutoBind
    private OylgPlatformService platformService;

    @Override
    public void decorate(HttpServletRequest request, View view) {
        super.decorate(request, view);
        view.setVariableIfAbsent("mainMenu", buildDefaultMainMenu());
        view.setVariableIfAbsent("commonFragments", buildDefaultCommonFragments());
        view.setVariableIfAbsent("footerFragments", buildDefaultFooterFragments());
        view.setVariableIfAbsent("currentYear", LocalDate.now().getYear());
        view.setVariableIfAbsent("shellMode", "public");
        view.setVariableIfAbsent("activeNav", "home");
        if (platformService != null) {
            view.setVariableIfAbsent("globalPackages", platformService.getActivePackages());
        }
    }

    private List<Map<String, String>> buildDefaultMainMenu() {
        return Arrays.asList(
            menuItem("Mô hình 3 Tầng", "/#mo-hinh-3-tang"),
            menuItem("Gói học & Học phí", "/#bang-gia-goi-hoc"),
            menuItem("Hội đồng Chuyên gia", "/#hoi-dong-chuyen-gia"),
            menuItem("Nội trú & Bán trú", "/#noi-tru-an-toan"),
            menuItem("Đặt lịch tư vấn", "/#dat-lich-tu-van")
        );
    }

    private Map<String, String> buildDefaultCommonFragments() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(
            "main_header_announcement",
            "Hướng nghiệp, Cố vấn Cuộc sống & Gia sư bù lỗ hổng gốc Lớp 1–12"
        );
        return map;
    }

    private Map<String, String> buildDefaultFooterFragments() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(
            "company_intro",
            "Đồng hành Hướng nghiệp, Cố vấn Cuộc sống và Gia sư 1–1 bù lỗ hổng kiến thức gốc cho học sinh phổ thông Lớp 1–12."
        );
        map.put(
            "contact_information",
            "TP. Buôn Ma Thuột, Đắk Lắk · Tổng đài tư vấn: 1900 636 888 · Đường dây Bảo vệ Trẻ em: 111"
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
