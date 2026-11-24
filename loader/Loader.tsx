// React-компонент лоадера.
// Использование:
//   <Loader />                      — белые точки на синем фоне
//   <Loader color="#0066cb" />      — на светлом фоне (txt/accent)

import type { CSSProperties } from "react"
import "./loader.css"

type Props = {
  /** Цвет точек. По умолчанию белый (txt/invert) */
  color?: string
  /** Текст для скринридеров */
  label?: string
  className?: string
}

export function Loader({ color, label = "Загрузка", className }: Props) {
  const style = color ? ({ "--loader-color": color } as CSSProperties) : undefined

  return (
    <div className={["loader", className].filter(Boolean).join(" ")} role="status" aria-live="polite" style={style}>
      <span className="loader__dot" aria-hidden="true" />
      <span className="loader__dot" aria-hidden="true" />
      <span className="loader__dot" aria-hidden="true" />
      <span className="loader__label">{label}</span>
    </div>
  )
}

export default Loader
