# Золотарь 58

Исходный код сайта **zolotar58.ru**.

## Структура

- `src/pages/` — HTML-страницы сайта. Имена файлов сохраняются, чтобы публичные URL не менялись.
- `src/assets/images/` — фотографии и изображения.
- `src/assets/icons/` — favicon и SVG-иконки.
- `src/styles/` — CSS.
- `src/scripts/` — клиентская логика на TypeScript.
- `public/` — файлы, которые должны попасть в корень опубликованного сайта: `robots.txt`, `sitemap.xml`, файл верификации.
- `.github/workflows/` — автоматическая сборка и публикация GitHub Pages.
- `dist/` — временный результат сборки, в репозиторий не коммитится.

## Сборка

```bash
npm install
npm run build
```

Сборка компилирует TypeScript в обычный JavaScript и сохраняет итоговый сайт в `dist/`.

В production GitHub Actions собирает сайт из исходников и публикует содержимое `dist/`. Публичные URL и внешний вид сайта при этом сохраняются.
