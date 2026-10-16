import type { CSSProperties } from 'react'

const EMBER_COUNT = 14
const SMOKE_WISP_COUNT = 5

export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-glow" />
      <div className="atmosphere-smoke">
        {Array.from({ length: SMOKE_WISP_COUNT }, (_, i) => (
          <span key={`smoke-${i}`} className={`atmosphere-smoke__wisp atmosphere-smoke__wisp--${i + 1}`} />
        ))}
      </div>
      <div className="atmosphere-embers">
        {Array.from({ length: EMBER_COUNT }, (_, i) => (
          <span
            key={`ember-${i}`}
            className="atmosphere-ember"
            style={{ '--i': i } as CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}
