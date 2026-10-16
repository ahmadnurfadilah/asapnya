import {
  useCallback,
  useRef,
  type PointerEvent,
  type WheelEvent,
} from 'react'
import {
  computeCoverRect,
  type PhotoTransform,
} from '../lib/drawProfile'
import { OVERLAY_SRC } from '../lib/constants'

type ProfilePreviewProps = {
  userImage: HTMLImageElement
  previewSize: number
  transform: PhotoTransform
  overlayOpacity: number
  onTransformChange: (next: PhotoTransform) => void
}

export function ProfilePreview({
  userImage,
  previewSize,
  transform,
  overlayOpacity,
  onTransformChange,
}: ProfilePreviewProps) {
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    base: PhotoTransform
  } | null>(null)

  const rect = computeCoverRect(
    userImage.naturalWidth,
    userImage.naturalHeight,
    previewSize,
    transform,
  )

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        base: transform,
      }
    },
    [transform],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      const dx = event.clientX - drag.startX
      const dy = event.clientY - drag.startY

      onTransformChange({
        ...drag.base,
        offsetX: drag.base.offsetX + dx,
        offsetY: drag.base.offsetY + dy,
      })
    },
    [onTransformChange],
  )

  const onPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault()
      const delta = event.deltaY > 0 ? -0.04 : 0.04
      const nextScale = Math.min(3, Math.max(0.5, transform.scale + delta))
      onTransformChange({ ...transform, scale: nextScale })
    },
    [transform, onTransformChange],
  )

  return (
    <div
      className="preview-frame"
      style={{ width: previewSize, height: previewSize }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      role="img"
      aria-label="Pratinjau foto profil dengan overlay asap"
    >
      <div className="preview-photo-layer">
        <img
          src={userImage.src}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            maxWidth: 'none',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>
      <div className="preview-ember-glow" aria-hidden="true" />
      <img
        className="preview-overlay preview-overlay--live"
        src={OVERLAY_SRC}
        alt=""
        draggable={false}
        style={{ opacity: overlayOpacity }}
      />
      <p className="preview-hint">Geser · scroll zoom</p>
    </div>
  )
}
