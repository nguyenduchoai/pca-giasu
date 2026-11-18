# AGENTS.md

Guidance for developers and AI agents working on **All Your Life (OYLG)**, an EzyPlatform project generated from the SDK template.

When adding a feature, follow `SKILL.md` for data design (reuse core tables, install a business plugin, create/alter SQL scripts) and the layers (entity, repository, model, service, converter, request, response, validator, controller service, decorator, view controller, api controller).

## 1. Project layout

| Module | Package | Purpose |
|---|---|---|
| `oylg-theme` | `com.allyourlife.oylg.web` | Thymeleaf pages, static assets, view controllers, view decorator |
| `oylg-web-plugin` | `com.allyourlife.oylg.web` | Public REST APIs (`/api/v1/oylg/...`), global error/exception handlers |
| `oylg-admin-plugin` | `com.allyourlife.oylg.admin` | Admin pages and APIs, mounted under `/oylg/...` |
| `oylg-socket-plugin` | `com.allyourlife.oylg.socket.plugin` | Socket login (EzyPlatform account or guest) |
| `oylg-socket-app` | `com.allyourlife.oylg.socket.app` | Real-time game server (join, move, chat) |
| `oylg-sdk` | `com.allyourlife.oylg` | Shared code; only generated when the project has 2+ modules |

Rules of thumb:
- Keep each module compilable on its own. Theme and admin plugin each have their own settings model (`WebOylgSettings`, `AdminOylgSettings`) on purpose.
- Java 8, Lombok available, 4-space indentation, max line length 100, checkstyle runs on `mvn install` (`checkstyle.xml`).
- Build and export with `./export.sh`; run the `*StartupTest` main classes of the theme (port 8080, includes the web plugin), admin plugin (port 9090) and socket app (port 2208) to test locally.

## 2. Reuse existing controllers instead of rewriting them

EzyPlatform and its plugins ship **base controllers that are not annotated with `@Controller`**. They already contain routes (`@DoGet`, `@DoPost`...), validation, pagination and view variables. A route only becomes active when your module declares a subclass annotated with `@Controller` (view) or `@Api` + `@Controller("/api/v1")` (API).

Before writing a new controller, check this list. If a base exists:
1. Extend it with an empty body to activate it.
2. Override its `protected` hooks (`decorate*View`, `get*Template`, `pre*`) to customize.
3. Provide the templates it renders in `oylg-theme/src/main/resources/templates/`.

Do **not** subclass controllers that are already `@Controller` inside a plugin (for example ezyarticle `CommentManagementController`, `ApiContentController`, ecommerce `WebProductController`, core `WebApiMediaController`, `WebApiManagementController`): the route would be registered twice.

### 2.1 Core platform

| Base class | Routes | Templates / notes |
|---|---|---|
| `org.youngmonkeys.ezyplatform.web.controller.view.WebErrorController` | `/bad-request`, `/permission-denied`, `/not-found`, `/server-error` | `ezycommon/errors/400..500`; hook `newViewBuilder(request, pageName)`. Already activated by `WebOylgErrorController` |
| `org.youngmonkeys.ezyplatform.web.controller.WebGlobalExceptionHandler` | exception mapping | Activate with `@ExceptionHandler`; maps `HttpNotFoundException`, `ResourceNotFoundException`, `BadRequestException`, token errors to JSON (API) or error views |
| `org.youngmonkeys.ezyplatform.web.controller.WebGlobalErrorHandler` | unhandled errors | Only one per website; activate with `@EzySingleton`; hooks `processError`, `postProcessError` |
| `org.youngmonkeys.ezyplatform.web.controller.api.WebApiAccountController` | `/account/update...` | Activate with `@Api @Authenticated @Controller("/api/v1")` |
| `WebApiLetterController`, `WebApiNotificationController`, `WebApiMediaDetailsController` (same package) | `/account/letters`, `/account/notifications`, `/media/{name}` | Same activation pattern |
| `org.youngmonkeys.ezyplatform.web.view.WebViewDecorator` | every view | Already extended by `WebOylgViewDecorator`; adds `user`, `loggedIn`, languages |
| `org.youngmonkeys.ezyplatform.admin.controller.view.AdminModuleIndexController` | admin `/` | Already extended by `IndexController`; renders the module menu |

### 2.2 EzyArticle (`ezyarticle-web-plugin`, package `org.youngmonkeys.ezyarticle.web.controller`)

| Base class | Routes | Templates the theme must provide | Hooks |
|---|---|---|---|
| `view.PostController` | `/posts`, `/posts/{slug}` | `posts/list`, `posts/details` | `decoratePostsView`, `decoratePostDetailsView` |
| `view.PageController` | `/{slug}`, `/pages/{slug}` | `pages/details` | `getPageByTypesAndSlug`, `decoratePageDetailsView`; `slugGet` is public for composition |
| `view.HomeController` | `/` | `index` | `decorateHomeView` |
| `view.BlogController` | `/blog`, `/blogs/{term}`, `/blog/{slug}` | `blog/list`, `blog/details` | `decorateBlogView`, `decorateBlogDetailsView` |
| `view.NewsController` | `/news`, `/news/{slug}` | `news/list`, `news/details` | `getNewsPagination`, `getNewsBySlug`, `decorateNewsDetailsView` |
| `view.SearchController` | `/search` | `posts/list` | `decorateSearchView` |
| `view.QuestionController`, `view.NotificationPostController` | `/questions...`, `/notification-posts...` | `questions/*`, `notification-posts/*` | `decorate*View` |
| `view.PostManagementController`, `view.PageManagementController` | `/posts/{slug}/preview`, `/pages/{slug}/preview` | `getPreviewTemplate()` | |
| `api.ApiPostController` | `/posts`, `/posts/recent`, `/posts/{slug}`, `/posts/{postId}/content` | | |
| `api.ApiCommentController`, `api.ApiTermController`, `api.ApiBlogController`, `api.ApiNewsController` | comments, terms, blogs, news | | |

Useful services: `WebPostControllerService` (published post pagination, by slug, by term), `WebTermControllerService`, `WebCommentControllerService`, `WebMenuControllerService`, `WebPageFragmentManager`. View decorator base: `org.youngmonkeys.ezyarticle.web.view.WebEzyArticleViewDecorator` (adds `commonFragments`, categories, page metas).

### 2.3 Ecommerce (`ecommerce-web-plugin`, package `org.youngmonkeys.ecommerce.web.controller`)

| Base class | Routes | Templates | Hooks |
|---|---|---|---|
| `view.WebCheckoutController` | `/checkout/shopping-cart` | `checkout/shopping-cart`, `checkout/shopping-cart-empty` (defaults shipped) | `getShoppingCartTemplate`, `decorateShoppingCartView` |
| `view.WebOrderController` | `/orders`, `/orders/{id}`, `/orders/{id}/payment-error` | `orders/list`, `orders/details`, `orders/payment-error` | `decorateOrdersView`, `decorateOrderDetailsView` |
| `view.WebAffiliateController`, `view.WebCommissionController` | `/affiliate...`, `/commission` | `affiliate/*`, `commission/list` | `get*Template` |
| `api.WebApiCheckoutController` | `/checkout`, `/checkout/context`, `/checkout/shopping-cart-products/...` | | `preCheckout`, `preAddShoppingCartProductAmount` |
| `api.WebApiOrderController` | `/orders`, `/orders/create`, `/orders/create-payment-url` | | `preCreateOrder`, `createOrderPaymentUrl` |
| `api.WebApiProductController`, `api.WebApiShoppingCartController`, `api.WebApiVoucherController`, `api.WebApiCategoryController`... | products, cart, vouchers, categories | | `getValidProductStatuses` |

Ecommerce ships reusable fragments, so a theme page can be a thin wrapper:
```html
<th:block th:replace="~{ecommerce/orders/list :: content}"/>
```

### 2.4 Other plugins

The same pattern exists in other plugins, e.g. ezyaccount `org.youngmonkeys.ezyaccount.web.controller.view.AccountController` (`/account`, `/account/edit`, `/account/inbox`...). Search the plugin's `web.controller.view` / `web.controller.api` packages for classes without `@Controller`.

## 3. Templates for reuse

Activate a base view controller (theme, `com.allyourlife.oylg.web.controller.view`):
```java
@Controller
public class WebOylgPostController extends PostController {}
```

Customize with a hook:
```java
@Setter
@Controller
public class WebOylgPostController extends PostController {

    @EzyAutoBind
    private WebOylgSettingService themeSettingService;

    @Override
    protected void decoratePostDetailsView(
        HttpServletRequest request,
        long postId,
        View.Builder viewBuilder
    ) {
        viewBuilder.addVariable("themeSettings", themeSettingService.getSettings());
    }
}
```

Disable an inherited route you do not want:
```java
@Override
protected void decoratePostsView(View.Builder viewBuilder) {
    throw new HttpNotFoundException("posts page is disabled");
}
```

Activate a base API controller (web plugin, `com.allyourlife.oylg.web.controller.api`):
```java
@Api
@Controller("/api/v1")
public class WebOylgApiPostController extends ApiPostController {}
```

Add validation before a base API action:
```java
@Api
@Setter
@Authenticated
@Controller("/api/v1")
public class WebOylgApiCheckoutController extends WebApiCheckoutController {

    @EzyAutoBind
    private WebOylgCheckoutValidator checkoutValidator;

    @Override
    protected void preCheckout(long userId, CheckoutRequest request) {
        checkoutValidator.validate(userId, request);
    }
}
```

Compose instead of inherit (fallback when a page does not exist):
```java
@Controller
@AllArgsConstructor
public class WebOylgHomeController {

    private final WebOylgPageController pageController;

    @DoGet("/")
    public Object home(RequestArguments arguments) {
        try {
            return pageController.slugGet(arguments, "home");
        } catch (HttpNotFoundException | ResourceNotFoundException e) {
            return View.of("home");
        }
    }
}
```

Base controllers use field injection (`@EzyAutoBind protected ...`), so a subclass can use inherited services such as `postControllerService`, `commonValidator`, `languageControllerService` directly in extra routes.

## 4. Depending on a plugin

1. **Install the plugin in the local EzyPlatform first** (admin → Modules / Market). Linking fails if the plugin is not installed; ask the user to install it instead of copying jars.
2. Link it from the project root: `ezy.sh link <plugin> [-m admin-plugin,web-plugin,theme]`. The SDK adds version properties, `system` dependencies pointing to `$EZYPLATFORM_HOME`, test resource folders and the plugin package to the startup tests.
3. Add the plugin to `dependencies=` in each affected `module.properties`, e.g. `dependencies=ezyarticle,ecommerce`.
4. After upgrading plugins in EzyPlatform, run `ezy.sh set-dependencies-version` to sync the `<plugin>.version` properties in the root pom, then rebuild / `./export.sh`.
5. Activate the base controllers you need (section 3) and provide their templates.

Details and examples: `SKILL.md` section 3.2.

## 5. Conventions used by this project

- **Pages**: `layout:decorate="~{ezytheme}"`, content in `layout:fragment="content"`, scripts in `layout:fragment="scripts"`. The theme layout is `templates/page.html`; header/footer are `fragments/header.html` and `fragments/footer.html` and respect `commonFragments` / `pageFragments` overrides from the admin.
- **View building**: theme views are built by `WebOylgPageViewFactory` (page title key, current page, per-page CSS via `themeStyles`, section on/off check). Reuse it in new controllers.
- **Settings**: stored as one JSON setting `oylg_settings`, saved by the admin plugin (`AdminOylgSettingService`) and cached by the theme (`WebOylgSettingService`, refresh every 3 seconds). Available in templates as `themeSettings` and in JS as `SM.settings`.
- **Errors**: throw `HttpNotFoundException`, `HttpBadRequestException(Map)` or `ResourceNotFoundException`; the global handlers render JSON for APIs and error views for pages.
- **Pagination**: cursor-based with `nextPageToken`, `prevPageToken`, `lastPage`, `limit`; validate with `CommonValidator.validatePageSize`, return `PaginationModel<T>`.
- **Admin**: menu entries in `oylg-admin-plugin/menus.properties` (`top.` section, `~` for hidden entries); every admin route is auto-prefixed with `/oylg`; static files in `static/oylg/` are served at `/oylg/...`; extra CSS for all admin pages is appended by `AdminOylgViewDecorator` (`additionalStyleFiles`) only when the request has an `AdminId` attribute (logged in), so the login, 2FA and setup pages do not request plugin files that need authentication.
- **i18n**:
  - Use message keys in templates, never plain text. Each module keeps its messages in `src/main/resources/messages/messages.properties` (default) and `messages_vi.properties` (Vietnamese); add keys to these files, do not create extra message files.
  - Prefix every key with its group (`shop.`, `blog.`...) and declare the English value; translate every key in `_vi` files using `\uXXXX` escapes; sort keys a-z inside each group.
  - Keys starting with `js.` are injected into `ezyweb.messages` automatically; read them in JS with `SM.t("js.group.key", "fallback")`.
  - Message values containing `'` or `}` go through `MessageFormat`: write apostrophes as `''`, never use named placeholders like `{name}`; use `%name%` with `SM.format(...)` in JS, or `{0}` with real Thymeleaf parameters.
- **Code style**: no code comments; 4 spaces in HTML/CSS/JS; the first tag after `<body>` is not indented; code inside `<script>` starts at the same indentation as the tag; HTML built in JS template literals is indented with the closing backtick at the inner markup level.
- **Assets**: only PNG and SVG images in templates (the SDK generator copies other binary formats as text and corrupts them).
