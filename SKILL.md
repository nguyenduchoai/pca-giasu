---
name: ezyplatform-layered-coding
description: Use when adding a feature (data, API, page or admin screen) to All Your Life (OYLG). Explains how to design data (reuse core tables, install a business plugin, or write create/alter SQL scripts) and the EzyPlatform layers entity, repository, model, service, converter, request, response, validator, controller service, decorator, view controller and api controller, where each class lives and how they call each other.
---

# EzyPlatform layered coding

Read `AGENTS.md` first (project layout, reusable base controllers, conventions). This skill describes how to write a new feature end to end. Example feature used below: **Monster** (a game monster with a name, level and status) in package `com.allyourlife.oylg`.

## 1. Data flow

```
HTTP request
  -> Request (+ Validator)
  -> ApiController / ViewController
  -> ControllerService               (only for read/complex flows)
  -> RequestToModelConverter -> SaveModel
  -> Service  -> ModelToEntityConverter -> Entity -> Repository -> DB
  <- Service  <- EntityToModelConverter <- Entity
  <- Decorator (loads related data in parallel)
  <- ModelToResponseConverter -> Response / View variables
```

Rules:
- **Entities never leave the service layer.** Services take and return models.
- **Requests and responses never enter the service layer.** Controllers convert them.
- **Controllers stay thin:** validate, convert, call one service or controller service, return.
- One responsibility per class; converters contain no I/O; decorators contain no business rules.

## 2. Where each layer lives

| Layer | Module | Package | Naming |
|---|---|---|---|
| Entity | sdk | `com.allyourlife.oylg.entity` | `Monster` |
| Result (projection) | sdk | `com.allyourlife.oylg.result` | `MonsterStatusResult` |
| Repository | sdk | `com.allyourlife.oylg.repo` | `MonsterRepository` |
| Model | sdk | `com.allyourlife.oylg.model` | `MonsterModel`, `SaveMonsterModel` |
| Converter | sdk | `com.allyourlife.oylg.converter` | `OylgEntityToModelConverter`, `OylgModelToEntityConverter` |
| Service (base) | sdk | `com.allyourlife.oylg.service` | `MonsterService` (no bean annotation) |
| Service (bean) | web / admin | `com.allyourlife.oylg.web.service`, `com.allyourlife.oylg.admin.service` | `WebMonsterService`, `AdminMonsterService` |
| Request | web / admin | `com.allyourlife.oylg.web.request`, `com.allyourlife.oylg.admin.request` | `SaveMonsterRequest` |
| Response | web / admin | `com.allyourlife.oylg.web.response`, `com.allyourlife.oylg.admin.response` | `WebMonsterResponse`, `AdminMonsterResponse` |
| Validator | web / admin | `...validator` | `AdminMonsterValidator` |
| Request/response converters | web / admin | `...converter` | `AdminRequestToModelConverter`, `AdminModelToResponseConverter` |
| Decorator | web / admin | `...controller.decorator` | `AdminMonsterModelDecorator` |
| Controller service | web / admin | `...controller.service` | `AdminMonsterControllerService` |
| API controller | web plugin / admin plugin | `...controller.api` | `WebApiMonsterController`, `AdminApiMonsterController` |
| View controller | theme / admin plugin | `...controller.view` | `WebOylgMonsterController`, `AdminMonsterController` |

The sdk module only exists when the project has two or more modules. Put shared entities, repositories, models, base services and entity/model converters there so the web plugin, theme, admin plugin and socket app can all reuse them. Code generators live in `oylg-sdk/src/test/java/test/` (repository, builder, pagination classes, unit tests); prefer running them over writing boilerplate by hand.

## 3. Database design: reuse first, create last

Follow this order before adding any table:

### 3.1 Reuse core tables (always installed)

| Need | Table | Entity / service (common-sdk) |
|---|---|---|
| Key/value configuration, feature flags, JSON settings | `ezy_settings` | `SettingService` (`setObjectValue`, `getObjectValue`, cached values) |
| Extra attributes of any record (1-n) | `ezy_data_meta` (`data_type`, `data_id`, `meta_key`, value / number / text) | `DataMetaService` |
| One unique value per record and key (counters, flags, external ids) | `ezy_unique_data` (`data_type`, `data_id`, `unique_key`) | `UniqueDataService` |
| Relations between any two records with quantity / order / extra data | `ezy_data_mappings` (`mapping_name`, `from_data_id`, `to_data_id`) | `DataMappingService` |
| Translations of any record | `ezy_data_i18n` | `Data18nService` |
| Search keywords / indexes, record counters | `ezy_data_indices`, `ezy_data_record_counts` | `DataIndexService`, `DataRecordCountService` |
| Users, admins, roles, media, letters, notifications, content templates | `ezy_users`, `ezy_user_meta`, `ezy_admins`, `ezy_medias`, `ezy_letters`, `ezy_notifications`, `ezy_content_templates`... | `UserService`, `UserMetaService`, `MediaService`, `LetterService`, `NotificationService`, `ContentTemplateService` |

Use `data_type` values prefixed with the project (`oylg_monster`) to avoid collisions.

### 3.2 Install a plugin that already models the business

Before designing a domain from scratch, check whether an EzyPlatform plugin covers it, install it from the admin (Modules / Market) or into `$EZYPLATFORM_HOME`, then reuse its tables, entities and services:

| Business | Plugin | Main tables (prefix) |
|---|---|---|
| Posts, pages, blog, news, menus, categories/tags, comments | `ezyarticle` | `ezyarticle_posts`, `ezyarticle_post_meta`, `ezyarticle_terms`, `ezyarticle_post_terms`, `ezyarticle_menus`, `ezyarticle_comments`, `ezyarticle_posts_i18n` |
| Products, prices, carts, orders, vouchers, shops, invoices, affiliate | `ecommerce` | `ecommerce_products`, `ecommerce_product_prices`, `ecommerce_shopping_carts`, `ecommerce_orders`, `ecommerce_order_products`, `ecommerce_vouchers`, `ecommerce_shops`... |
| Accounts, login, payment, mail, chat, CRM, support, rating, SEO, delivery | `ezyaccount`, `ezylogin`, `ezypayment`, `ezymail`, `ezychat`, `ezycrm`, `ezysupport`, `ezyrating`, `ezyseo`, `ezydelivery` | see each plugin's `admin-plugin/src/main/resources/scripts` |

Examples: store game patch notes as ezyarticle posts with a custom `post_type`; extra fields go to `ezyarticle_post_meta`; store shop items as ecommerce products instead of a new `items` table. Then link the plugin (3.2.1) and inject its services (for example `WebPostService`, `WebProductService`) or extend its base classes.

#### 3.2.1 Link a plugin with the SDK tool

**The plugin must be installed in the local EzyPlatform first.** `ezy.sh link` reads the plugin's `dependencies.xml` from `$EZYPLATFORM_HOME/<admin|web|socket>/<plugins|themes|apps>/<plugin>/`; if the plugin is not installed it fails with `project <plugin> has no dependencies.xml file`. When the user asks to use a plugin that is not installed, stop and ask them to install it (EzyPlatform admin → Modules / Market, then restart) before linking. Never copy plugin jars or edit the `system` paths by hand.

Run from the project root (`ezy.sh` is in the SDK `bin` folder; use `$EZYPLATFORM_SDK/bin/ezy.sh` when it is not on `PATH`, `ezy.bat` on Windows):
```bash
ezy.sh link ezyarticle
ezy.sh link ecommerce -m admin-plugin,web-plugin,theme
```
`-m` limits the module types (`all`, `admin-plugin`, `socket-app`, `socket-plugin`, `theme`, `web-plugin`); without it every module is linked. The command:
- adds the plugin's version properties (for example `<ezyarticle.version>`) and common dependencies to the root `pom.xml`;
- adds the matching module dependencies to each module pom (the theme receives the web plugin dependencies);
- adds the plugin's `resources` folder to the module test profile;
- adds the plugin package to the `@ComponentsScan` of the module's `*StartupTest`, so startup tests load the plugin's controllers and services.

After linking, add the plugin to `dependencies=` in each affected `module.properties` (for example `dependencies=ezyarticle,ecommerce`) so EzyPlatform loads it before this project at runtime, then rebuild.

#### 3.2.2 Update plugin versions

When the plugins are upgraded in the local EzyPlatform, sync the versions in the root `pom.xml`:
```bash
ezy.sh set-dependencies-version
```
(aliases `sdv`, `-sdv`). It reads every `<name>.version` property of the root pom, finds the installed jar `$EZYPLATFORM_HOME/.../<name>/lib/<name>-<module-type>-<version>.jar` and updates the property when the version differs, printing `sync <name>'s version from: <old> to: <new>`. Run it before building after any plugin upgrade, then `./export.sh`. Upgrade the plugin itself in the EzyPlatform admin first; the command only follows what is installed. Use `ezy.sh help` to see all SDK commands and `ezy.sh update --check` to check for a newer SDK.

### 3.3 Create a new table only when 3.1 and 3.2 do not fit

SQL scripts live in `oylg-admin-plugin/src/main/resources/scripts/` and are exported to `resources/scripts`. EzyPlatform admin runs them automatically when the project is installed or updated:
- each file runs **once per module** and is recorded in `ezy_run_script_histories` (by file name), so never edit a file that has been released; add a new file instead;
- files whose name contains `alter` run after all create files; files are ordered by the number after the last `-` or `_` (`alter_monster_1.sql` before `alter_monster_2.sql`);
- statements are split by `;`; errors in `alter` files are only logged, errors in create files fail the install;
- scripts are skipped when `tables.create_manually=true`.

Create file, e.g. `scripts/oylg-tables.sql`:
```sql
CREATE TABLE IF NOT EXISTS `oylg_monsters` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `level` int NOT NULL DEFAULT 1,
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_name` (`name`),
    INDEX `index_status_level_id` (`status`, `level`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
```

Alter file for a later release, e.g. `scripts/oylg-alter-monsters-1.sql`:
```sql
ALTER TABLE `oylg_monsters`
ADD COLUMN `zone` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'meadow' AFTER `level`,
ADD INDEX `index_zone_status_id` (`zone`, `status`, `id`);
```

Table rules:
- Prefix tables with `oylg_`, plural snake_case names, `bigint unsigned` ids, `datetime` time columns, `utf8mb4_unicode_520_ci`, InnoDB.
- Always `CREATE TABLE IF NOT EXISTS`; keep alter files idempotent-friendly (they may be re-attempted on a fresh database after the create file already has the column).
- Design indexes from the queries: equality columns first, then range/sort columns, then `id` for cursor pagination. Before writing a query, read the table's `CREATE TABLE` SQL (and later alter files) and order `WHERE` conditions by the leftmost prefix of a matching index; if no index fits, add one in a new alter file.
- Reference users/admins/media by id columns (`user_id`, `creator_admin_id`, `featured_image_id`) instead of copying their data.
- Keep the create file and the entity in sync: when an alter file adds a column, add it to the entity and to the create file only if the create file has not been released yet.

### 3.4 Entity and repository (sdk)

```java
@Getter
@Setter
@Entity
@Table(name = "oylg_monsters")
@NoArgsConstructor
public class Monster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private int level;
    private String status;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

```java
public interface MonsterRepository extends EzyDatabaseRepository<Long, Monster> {

    Monster findByName(String name);

    @EzyQuery(
        "SELECT e FROM Monster e " +
            "WHERE e.status = ?0 " +
            "ORDER BY e.level DESC, e.id DESC"
    )
    List<Monster> findByStatusOrderByLevelDesc(String status, Next next);
}
```

- Field names in camelCase, columns in snake_case with `@Column`.
- Time columns are `LocalDateTime` in entities and `long` (epoch millis) in models.
- Use derived queries (`findByXAndY`) for simple cases, `@EzyQuery` (JPQL on entity names) otherwise; return `*Result` classes for projections.

## 4. Model and converters (sdk)

```java
@Getter
@Builder
public class MonsterModel {
    private long id;
    private String name;
    private int level;
    private String status;
    private long createdAt;
}

@Getter
@Builder
public class SaveMonsterModel {
    private String name;
    private int level;
    private String status;
}
```

```java
@EzySingleton
@AllArgsConstructor
public class OylgModelToEntityConverter {

    private final ClockProxy clock;

    public Monster toEntity(SaveMonsterModel model) {
        Monster entity = new Monster();
        mergeToEntity(model, entity);
        entity.setCreatedAt(entity.getUpdatedAt());
        return entity;
    }

    public void mergeToEntity(SaveMonsterModel model, Monster entity) {
        entity.setName(model.getName());
        entity.setLevel(model.getLevel());
        entity.setStatus(model.getStatus());
        entity.setUpdatedAt(clock.nowDateTime());
    }
}
```

`OylgEntityToModelConverter.toModel(Monster)` does the reverse (convert `LocalDateTime` with `ClockProxy.toTimestamp`). Keep one converter class per direction and add a method per type.

## 5. Service (sdk base + module bean)

```java
@AllArgsConstructor
public class MonsterService {

    private final MonsterRepository monsterRepository;
    private final OylgModelToEntityConverter modelToEntityConverter;
    private final OylgEntityToModelConverter entityToModelConverter;

    public long addMonster(SaveMonsterModel model) {
        Monster entity = modelToEntityConverter.toEntity(model);
        monsterRepository.save(entity);
        return entity.getId();
    }

    public void updateMonster(long monsterId, SaveMonsterModel model) {
        Monster entity = monsterRepository.findById(monsterId);
        if (entity == null) {
            throw new ResourceNotFoundException("monster");
        }
        modelToEntityConverter.mergeToEntity(model, entity);
        monsterRepository.save(entity);
    }

    public MonsterModel getMonsterById(long monsterId) {
        return entityToModelConverter.toModel(
            monsterRepository.findById(monsterId)
        );
    }
}
```

```java
@Service
public class AdminMonsterService extends MonsterService {

    public AdminMonsterService(
        MonsterRepository monsterRepository,
        OylgModelToEntityConverter modelToEntityConverter,
        OylgEntityToModelConverter entityToModelConverter
    ) {
        super(monsterRepository, modelToEntityConverter, entityToModelConverter);
    }
}
```

- The sdk service has no bean annotation; each module activates it with `@Service` (or `@EzySingleton`) and adds module-only methods.
- Services own transactions-level rules: existence checks, status transitions, uniqueness. They throw `ResourceNotFoundException` / `BadRequestException`.
- For lists use cursor pagination: a `PaginationMonsterService` built on `CommonPaginationService` + a filter + a pagination parameter converter (see the generators and platform `PaginationModelFetchers`).

## 6. Request, validator and request converter (web / admin)

```java
@Getter
@Setter
public class SaveMonsterRequest {
    private String name;
    private int level;
    private MonsterStatus status;

    public MonsterStatus getStatus() {
        return status == null ? MonsterStatus.ACTIVATED : status;
    }
}
```

```java
@EzySingleton
public class AdminMonsterValidator {

    public void validate(SaveMonsterRequest request) {
        Map<String, String> errors = new HashMap<>();
        if (isBlank(request.getName())) {
            errors.put("name", "required");
        } else if (request.getName().length() > 64) {
            errors.put("name", "tooLong");
        }
        if (request.getLevel() < 1 || request.getLevel() > 99) {
            errors.put("level", "invalid");
        }
        if (!errors.isEmpty()) {
            throw new HttpBadRequestException(errors);
        }
    }
}
```

- Error codes (`required`, `invalid`, `tooLong`, `duplicated`...) are mapped to i18n messages by `ezyweb` / `ezyadmin` JS (`processUpdateApiErrors`), keyed by field name.
- Validate input shape in validators; validate business rules (exists, duplicated) in services.

```java
@EzySingleton
public class AdminRequestToModelConverter {

    public SaveMonsterModel toModel(SaveMonsterRequest request) {
        return SaveMonsterModel.builder()
            .name(request.getName().trim())
            .level(request.getLevel())
            .status(request.getStatus().toString())
            .build();
    }
}
```

## 7. Response, response converter and decorator

```java
@Getter
@Builder
public class AdminMonsterResponse {
    private long id;
    private String name;
    private int level;
    private String status;
    private long kills;
    private long createdAt;
}
```

```java
@EzySingleton
public class AdminModelToResponseConverter {

    public AdminMonsterResponse toResponse(MonsterModel model, long kills) {
        return AdminMonsterResponse.builder()
            .id(model.getId())
            .name(model.getName())
            .level(model.getLevel())
            .status(model.getStatus())
            .kills(kills)
            .createdAt(model.getCreatedAt())
            .build();
    }
}
```

A **decorator** enriches models with related data (media, metas, counters, names) and builds responses. Load independent data in parallel with `Reactive.multiple()` and load lists in batch (by id collections) to avoid N+1 queries:

```java
@EzySingleton
@AllArgsConstructor
public class AdminMonsterModelDecorator {

    private final AdminMonsterStatisticService statisticService;
    private final AdminModelToResponseConverter modelToResponseConverter;

    public List<AdminMonsterResponse> decorate(List<MonsterModel> models) {
        List<Long> monsterIds = newArrayList(models, MonsterModel::getId);
        Map<Long, Long> killsByMonsterId = statisticService
            .getKillsMapByMonsterIds(monsterIds);
        return newArrayList(
            models,
            it -> modelToResponseConverter.toResponse(
                it,
                killsByMonsterId.getOrDefault(it.getId(), 0L)
            )
        );
    }
}
```

## 8. Controller service

A controller service combines services, pagination and decorators for one controller area, so view controllers and API controllers share the same read logic. It throws HTTP exceptions when data is missing.

```java
@Service
@AllArgsConstructor
public class AdminMonsterControllerService {

    private final AdminMonsterService monsterService;
    private final AdminMonsterModelDecorator monsterModelDecorator;

    public AdminMonsterResponse getMonsterById(long monsterId) {
        MonsterModel model = monsterService.getMonsterById(monsterId);
        if (model == null) {
            throw new HttpNotFoundException("monster");
        }
        return monsterModelDecorator.decorate(
            Collections.singletonList(model)
        ).get(0);
    }
}
```

## 9. API controller

```java
@Api
@Authenticated
@Controller("/api/v1")
@EzyFeature("oylg")
@AllArgsConstructor
public class AdminApiMonsterController {

    private final AdminMonsterService monsterService;
    private final AdminMonsterValidator monsterValidator;
    private final AdminMonsterControllerService monsterControllerService;
    private final AdminRequestToModelConverter requestToModelConverter;

    @DoPost("/monsters/add")
    public CreatedIdResponse monstersAddPost(@RequestBody SaveMonsterRequest request) {
        monsterValidator.validate(request);
        long monsterId = monsterService.addMonster(
            requestToModelConverter.toModel(request)
        );
        return new CreatedIdResponse(monsterId);
    }

    @DoPut("/monsters/{monsterId}")
    public ResponseEntity monstersMonsterIdPut(
        @PathVariable long monsterId,
        @RequestBody SaveMonsterRequest request
    ) {
        monsterValidator.validate(request);
        monsterService.updateMonster(monsterId, requestToModelConverter.toModel(request));
        return ResponseEntity.noContent();
    }

    @DoGet("/monsters/{monsterId}")
    public AdminMonsterResponse monstersMonsterIdGet(@PathVariable long monsterId) {
        return monsterControllerService.getMonsterById(monsterId);
    }
}
```

- Method names: `<path segments in camelCase><HttpMethod>` (`monstersMonsterIdPut`).
- Admin APIs: `@Authenticated` + `@EzyFeature`, mounted under `/oylg/api/v1/...`; inject `@AdminId long adminId` when needed. Web APIs: paths start with `/oylg/`, use `@Authenticated` + `@UserId long userId` for user data.
- Return a response object, `PaginationModel<T>`, `CreatedIdResponse` or `ResponseEntity.noContent()`; never return entities or models directly from public APIs when they expose internal fields.
- Check `AGENTS.md` section 2 first: the platform or a plugin may already provide a base API controller you can extend.

## 10. View controller

Theme (`oylg-theme`):
```java
@Controller
@AllArgsConstructor
public class WebOylgMonsterController {

    private final WebOylgPageViewFactory pageViewFactory;
    private final WebMonsterControllerService monsterControllerService;

    @DoGet("/game/monsters/{monsterId}")
    public View gameMonstersMonsterIdGet(@PathVariable long monsterId) {
        return View.builder()
            .template("game/monster-details")
            .addVariable("pageTitle", "game.monster_details_page_title")
            .addVariable("monster", monsterControllerService.getMonsterById(monsterId))
            .build();
    }
}
```

Admin plugin:
```java
@Controller
@Authenticated
@EzyFeature("oylg")
public class AdminMonsterController {

    @DoGet("/monsters")
    public View monstersGet() {
        return View.builder()
            .template("oylg/monsters/list")
            .build();
    }
}
```

- Prefer extending an existing base view controller (`AGENTS.md` section 2) and overriding its hooks.
- Theme templates live in `templates/`, decorate `~{ezytheme}`; admin templates live in `templates/oylg/`, decorate `~{ezyadmin}`; add admin menu entries to `menus.properties` (`top.oylg.monsters=/monsters; fas fa-dragon`, hidden detail pages with `~`).
- Put only page-level variables in the view; data for interactive widgets can be loaded by JS from the API.
- Every visible text uses message keys (see `AGENTS.md` i18n rules).

## 11. Checklist for a new feature

1. Data design: reuse core tables or a plugin first; otherwise add a create/alter script in `oylg-admin-plugin/src/main/resources/scripts/` with indexes matching the queries; entity, result and repository in sdk.
2. Models (`XxxModel`, `SaveXxxModel`), converters (entity <-> model) in sdk.
3. Base service in sdk; `@Service` subclass in each module that needs it.
4. Request, validator, request-to-model converter in the plugin.
5. Response, model-to-response converter, decorator (batch + parallel loading).
6. Controller service when reads are shared or complex.
7. API controller and/or view controller (extend platform/plugin bases when available).
8. Templates, menu entries, messages (`en` + `vi`), unit tests for services, validators, converters and decorators asserting business rules.
9. `mvn clean install` passes checkstyle; run the startup tests and try the feature.
