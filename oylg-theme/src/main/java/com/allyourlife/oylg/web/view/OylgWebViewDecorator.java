package com.allyourlife.oylg.web.view;

import com.allyourlife.oylg.model.OylgSiteSettings;
import com.allyourlife.oylg.service.OylgPlatformService;
import com.allyourlife.oylg.web.service.WebOylgSettingService;
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

    @EzyAutoBind
    private WebOylgSettingService webSettingService;

    @Override
    public void decorate(HttpServletRequest request, View view) {
        super.decorate(request, view);
        OylgSiteSettings settings = webSettingService != null
            ? webSettingService.getSettings()
            : new OylgSiteSettings();
        view.setVariableIfAbsent("themeSettings", settings);
        view.setVariableIfAbsent("mainMenu", buildDefaultMainMenu(settings));
        view.setVariableIfAbsent("footerFragments", buildDefaultFooterFragments(settings));
        view.setVariableIfAbsent("currentYear", LocalDate.now().getYear());
        view.setVariableIfAbsent("shellMode", "public");
        view.setVariableIfAbsent("activeNav", "home");
        if (platformService != null) {
            view.setVariableIfAbsent("globalPackages", platformService.getActivePackages());
        }
    }

    private List<Map<String, String>> buildDefaultMainMenu(OylgSiteSettings settings) {
        return Arrays.asList(
            menuItem("Phương pháp", "/#mo-hinh-3-tang"),
            menuItem("Học phí", "/#bang-gia-goi-hoc"),
            menuItem("Chuyên gia", "/#hoi-dong-chuyen-gia"),
            menuItem("Bán trú", "/#noi-tru-an-toan"),
            menuItem("Tư vấn", "/#dat-lich-tu-van")
        );
    }

    private Map<String, String> buildDefaultFooterFragments(OylgSiteSettings settings) {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(
            "company_intro",
            "Đồng hành Hướng nghiệp, Cố vấn Cuộc sống và Gia sư 1–1 bù lỗ hổng kiến thức gốc cho học sinh phổ thông Lớp 1–12."
        );
        map.put(
            "contact_information",
            "TP. Buôn Ma Thuột, Đắk Lắk · Tổng đài tư vấn: "
                + settings.getHotline()
                + " · Đường dây Bảo vệ Trẻ em: 111"
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
