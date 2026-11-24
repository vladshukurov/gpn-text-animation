export type TextRevealOptions = {
  phrases?: string | string[]
  loop?: boolean
  autoplay?: boolean
  respectReducedMotion?: boolean
  initialDelay?: number | [number, number]
  hold?: number
  gap?: number
  enterDuration?: number
  enterStagger?: number
  enterEasing?: string
  enterY?: number
  exitDuration?: number
  exitStagger?: number
  exitEasing?: string
  exitY?: number
}

export type TextRevealControls = {
  play(): TextRevealControls
  stop(): TextRevealControls
  destroy(): void
  readonly finished: Promise<void>
}

export function textReveal(element: Element, options?: TextRevealOptions): TextRevealControls
export default textReveal
