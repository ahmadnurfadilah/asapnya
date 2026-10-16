import { OUTPUT_SIZE } from './constants'
import { drawProfileToCanvas, type PhotoTransform } from './drawProfile'

export async function exportProfilePng(
  userImage: HTMLImageElement,
  overlayImage: HTMLImageElement,
  previewSize: number,
  transform: PhotoTransform,
  overlayOpacity: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas')

  drawProfileToCanvas(
    canvas,
    userImage,
    overlayImage,
    previewSize,
    transform,
    overlayOpacity,
    OUTPUT_SIZE,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('export_failed'))
          return
        }
        resolve(blob)
      },
      'image/png',
      1,
    )
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function canExportImages(): boolean {
  const canvas = document.createElement('canvas')
  return typeof canvas.toBlob === 'function'
}
