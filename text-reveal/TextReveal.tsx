// React-обёртка над text-reveal.js.
// Использование:
//   <TextReveal as="h1" className="hero__title">С первым рабочим днем, Александр!</TextReveal>
//
// Анимация запускается один раз, когда элемент появляется во вьюпорте
// и загружены шрифты. При смене текста анимация проигрывается заново.

import { createElement, useEffect, useRef, type ElementType } from "react"
import { textReveal } from "./text-reveal.js"
import "./text-reveal.css"

type Props = {
  children: string
  as?: ElementType
  className?: string
  /** Задержка старта, мс */
  delay?: number
  /** Запускать только при появлении во вьюпорте (по умолчанию true) */
  onView?: boolean
}

export function TextReveal({ children, as = "span", className, delay = 0, onView = true }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let instance: ReturnType<typeof textReveal> | null = null
    let observer: IntersectionObserver | null = null
    let cancelled = false

    const run = () => {
      document.fonts.ready.then(() => {
        if (cancelled) return
        instance = textReveal(el, { phrases: children, initialDelay: delay })
      })
    }

    if (onView && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer?.disconnect()
          run()
        }
      }, { threshold: 0.2 })
      observer.observe(el)
    } else {
      run()
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      instance?.destroy()
    }
  }, [children, delay, onView])

  // key={children}: при смене текста React пересоздаёт элемент целиком
  // и не пытается обновлять DOM, который разрезала анимация.
  return createElement(as, { ref, className, key: children }, children)
}

export default TextReveal
