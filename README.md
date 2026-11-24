# Анимации HR-портала «Газпром нефть»

В репозитории две анимации для HR-портала:

1. **Text reveal** — появление главного заголовка по буквам: каждая буква проявляется
   и поднимается снизу. Проигрывается один раз.
2. **Loader** — три точки с анимацией «дыхание»: точки по очереди проявляются и гаснут.

Внешних зависимостей нет: чистый JS и CSS на Web Animations API.
Для React есть готовые обёртки.

## Демо

ES-модули не работают через `file://`, поэтому демо нужно открывать через любой
статический сервер:

```bash
python3 -m http.server 8080
```

Затем откройте http://localhost:8080/demo/.

## Структура

```
text-reveal/
  text-reveal.js           — анимация, без зависимостей
  text-reveal.css          — обязательные стили обёрток букв
  text-reveal.d.ts         — типы TypeScript
  text-reveal.params.json  — параметры эффекта для других платформ (iOS, Android, Lottie)
  TextReveal.tsx           — React-компонент
loader/
  loader.css               — лоадер на чистом CSS
  Loader.tsx               — React-компонент
demo/
  index.html               — обе анимации на одной странице
```

---

## Text reveal

| Параметр | Значение |
|---|---|
| Единица анимации | буква (графема), пробелы и знаки препинания сохраняются |
| Opacity | `0 → 1` |
| Transform | `translateY(15px) → 0` |
| Длительность одной буквы | `500ms` |
| Задержка между буквами | `15ms` |
| Easing | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Blur | нет, буквы всегда чёткие |
| Повтор | нет, один раз при появлении |

Анимация заголовка из 33 знаков длится `32 × 15 + 500 = 980ms`.

### Vanilla JS

```html
<link rel="stylesheet" href="text-reveal/text-reveal.css">
<h1 id="title">С первым рабочим днем, Александр!</h1>

<script type="module">
  import { textReveal } from "./text-reveal/text-reveal.js"
  document.fonts.ready.then(() => textReveal(document.getElementById("title")))
</script>
```

`textReveal(el, options)` возвращает `{ play(), stop(), destroy(), finished }`.
При размонтировании вызывайте `destroy()`: он отменит анимации и вернёт исходный DOM.

### React

```tsx
import { TextReveal } from "./text-reveal/TextReveal"

<TextReveal as="h1" className="hero__title">
  {`С первым рабочим днем, ${user.firstName}!`}
</TextReveal>
```

Компонент запускает анимацию, когда элемент попадает во вьюпорт и шрифты уже загружены.
Если текст меняется, анимация проигрывается заново.

### Что учесть

- Запускайте анимацию после `document.fonts.ready`. Иначе буквы разрежутся
  по fallback-шрифту, а после подмены шрифта поедет ширина.
- Переносы строк остаются только между словами: слово целиком лежит в обёртке
  с `white-space: nowrap`.
- Полный текст записан в `aria-label`, а у отдельных букв стоит `aria-hidden`,
  поэтому скринридер читает фразу целиком.
- При `prefers-reduced-motion` текст показывается сразу, без анимации.

---

## Loader

| Параметр | Значение |
|---|---|
| Точка | 10 × 10, белая (`txt/invert`) |
| Расстояние между точками | 10px |
| Прозрачность | `0.25 → 1 → 0.25`, пик на 40% цикла |
| Цикл | `1.6s`, `ease-in-out`, бесконечно |
| Сдвиг между точками | `250ms` |
| Первый кадр | волна уже идёт: точки 1 / 0.7 / 0.4, как статика в Figma |
| Появление | через 300 мс, за 400 мс |
| `prefers-reduced-motion` | цикл замедляется до 2.4 с |

Задержка в 300 мс нужна, чтобы при быстрой загрузке лоадер не мигал.

### HTML

```html
<link rel="stylesheet" href="loader/loader.css">

<div class="loader" role="status" aria-live="polite">
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__dot" aria-hidden="true"></span>
  <span class="loader__label">Загрузка</span>
</div>
```

Настраивается через CSS-переменные на `.loader`: `--loader-color`, `--loader-dot`,
`--loader-gap`, `--loader-cycle`, `--loader-step`.

### React

```tsx
import { Loader } from "./loader/Loader"

<Loader />                   {/* белые точки на синем фоне */}
<Loader color="#0066cb" />   {/* на светлом фоне */}
```

Лоадер в портале бывает в двух раскладках: на весь экран (первая загрузка)
и в зоне контента рядом с сайдбаром. Сам компонент в обоих случаях одинаковый,
меняется только контейнер, в котором он центрируется.

---

## Макеты

Обе анимации собраны в Figma «ГПН | HR-портал»: страница Final → Section 1,
компоненты `Loader` и `ErrorScreen`.

## Источник эффекта

Text reveal основан на эффекте serega-gentle из
[mishanaer/deslop](https://github.com/mishanaer/deslop/tree/main/serega/serega-gentle),
а тот — на рецепте per-character rise от [Pixel Point](https://pixelpoint.io/skills/animate-text/).
