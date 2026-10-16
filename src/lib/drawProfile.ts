export type PhotoTransform = {
  /** Multiplier on top of cover-fit scale */
  scale: number
  /** Pan offset in preview pixels */
  offsetX: number
  offsetY: number
}

export const DEFAULT_TRANSFORM: PhotoTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
}

export function computeCoverRect(
  imageWidth: number,
  imageHeight: number,
  frameSize: number,
  transform: PhotoTransform,
) {
  const baseScale = Math.max(frameSize / imageWidth, frameSize / imageHeight)
  const scale = baseScale * transform.scale
  const drawWidth = imageWidth * scale
  const drawHeight = imageHeight * scale

  const x = (frameSize - drawWidth) / 2 + transform.offsetX
  const y = (frameSize - drawHeight) / 2 + transform.offsetY

  return { x, y, width: drawWidth, height: drawHeight }
}

/** Map preview-space offsets to output canvas size */
export function computeCoverRectForExport(
  imageWidth: number,
  imageHeight: number,
  outputSize: number,
  previewSize: number,
  transform: PhotoTransform,
) {
  const baseScale = Math.max(outputSize / imageWidth, outputSize / imageHeight)
  const scale = baseScale * transform.scale
  const drawWidth = imageWidth * scale
  const drawHeight = imageHeight * scale
  const ratio = outputSize / previewSize

  const x = (outputSize - drawWidth) / 2 + transform.offsetX * ratio
  const y = (outputSize - drawHeight) / 2 + transform.offsetY * ratio

  return { x, y, width: drawWidth, height: drawHeight }
}

export function drawProfileToCanvas(
  canvas: HTMLCanvasElement,
  userImage: HTMLImageElement,
  overlayImage: HTMLImageElement,
  previewSize: number,
  transform: PhotoTransform,
  overlayOpacity: number,
  outputSize: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas_unsupported')
  }

  canvas.width = outputSize
  canvas.height = outputSize

  const rect = computeCoverRectForExport(
    userImage.naturalWidth,
    userImage.naturalHeight,
    outputSize,
    previewSize,
    transform,
  )

  ctx.clearRect(0, 0, outputSize, outputSize)
  ctx.drawImage(userImage, rect.x, rect.y, rect.width, rect.height)

  ctx.globalAlpha = overlayOpacity
  ctx.drawImage(overlayImage, 0, 0, outputSize, outputSize)
  ctx.globalAlpha = 1
}
