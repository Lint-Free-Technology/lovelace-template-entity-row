## [2.2.0](https://github.com/lint-free-technology/lovelace-template-entity-row/compare/v2.1.1...v2.2.0) (2026-04-21)

### ⭐ New Features

* boolean nested_templates option for nested Jinja2 bracket syntax ([#32](https://github.com/lint-free-technology/lovelace-template-entity-row/issues/32)) ([63eac5b](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/63eac5b74ed2d487a9d7340fc72f6550a741b6e1))

### 🐞 Bug Fixes

* Use`state_display` when needing to display template which may not be a valid raw `state`. ([d2a59d6](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/d2a59d62945eac2fa27058663b6df1c307fad51b)), closes [#34](https://github.com/lint-free-technology/lovelace-template-entity-row/issues/34)

## [2.1.1](https://github.com/lint-free-technology/lovelace-template-entity-row/compare/v2.1.0...v2.1.1) (2026-02-12)

### ⚙️ Miscellaneous

* Hide chores for release notes ([1b6c048](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/1b6c04859be946da21ad04cbc4fe0131c176b7f3))
* Update console branding to distinguish fork. ([28d017e](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/28d017ec203027283aee20d5cc88ed63596d2b43))
* Update LFT console branding color to LFT red ([a14cf56](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/a14cf56c03ebd187c07eb953ec8a11298d9c6972))

## [2.1.0](https://github.com/lint-free-technology/lovelace-template-entity-row/compare/v2.0.0...v2.1.0) (2026-02-10)

### ⭐ New Features

* Add button option for state display. ([e02ed75](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/e02ed759466c1af0570eea97506a9dbce6ef7915))
* Allow default button config with `button: true`. ([337963c](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/337963cf4c2b926d1cb74fd6722db42c97b51165))

### 🐞 Bug Fixes

* Localize state display when not overridden in config ([db87ea2](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/db87ea2ff4b63e0b23b1b75d1ec9e266ca58c010))

### 📔 Documentation

* Update localization key example in README ([b79ed3b](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/b79ed3bbcba041ab21a2cc79e07aef95c19b6ec0))

### ⚙️ Miscellaneous

* **ci:** Update release to manual only ([ddf40c9](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/ddf40c9447bab9d8a77fd66c754b3b6227a7baa9))
* **docs:** Update CHANGELOG with recent fixes and updates ([0c4f12b](https://github.com/lint-free-technology/lovelace-template-entity-row/commit/0c4f12bc2c51dffec81855f21d4fabaa1749e22e))

## [2.0.0](https://github.com/lint-free-technology/lovelace-template-entity-row/compare/v1.4.1...v2.0.0) (2026-02-08)

### 🐞 Bug Fixes

- Update readme for state_color
- Trim entity template to be valid when contains newline.
- Force state_color: false when no valid entity state.
- Fix state display being overridden by active
- Fix active and allow state_color
- Fix double-tap and only show action pointer when an action is set
- Fix condition on first load by
- Fix conditional row gaps since 2025.11
