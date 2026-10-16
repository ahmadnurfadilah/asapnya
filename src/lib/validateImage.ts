import {
  ACCEPTED_EXTENSIONS_LABEL,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_BYTES,
} from './constants'

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateImageFile(file: File): ValidationResult {
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      message: `Format tidak didukung. Gunakan ${ACCEPTED_EXTENSIONS_LABEL}.`,
    }
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: 'Ukuran file terlalu besar. Pilih gambar di bawah 10 MB.',
    }
  }

  return { ok: true }
}

export type LoadedUserImage = {
  image: HTMLImageElement
  objectUrl: string
}

export function loadImageFromFile(file: File): Promise<LoadedUserImage> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ image: img, objectUrl })
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('read_failed'))
    }
    img.src = objectUrl
  })
}
