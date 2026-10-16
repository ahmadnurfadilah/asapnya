import { useCallback, useEffect, useRef, useState } from 'react'
import { CAMPAIGN_CAPTION, OVERLAY_SRC } from '../lib/constants'
import { DEFAULT_TRANSFORM, type PhotoTransform } from '../lib/drawProfile'
import {
  canExportImages,
  downloadBlob,
  exportProfilePng,
} from '../lib/exportProfile'
import { loadImageFromFile } from '../lib/validateImage'
import { ProfilePreview } from './ProfilePreview'
import { UploadZone } from './UploadZone'

const MIN_PREVIEW = 200
const MAX_PREVIEW = 480

export function EditorPanel() {
  const previewSlotRef = useRef<HTMLDivElement>(null)
  const [previewSize, setPreviewSize] = useState(320)
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null)
  const photoUrlRef = useRef<string | null>(null)
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(
    null,
  )
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM)
  const [overlayOpacity, setOverlayOpacity] = useState(0.92)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [captionCopied, setCaptionCopied] = useState(false)

  useEffect(() => {
    return () => {
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current)
        photoUrlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => setOverlayImage(img)
    img.onerror = () =>
      setError('Overlay asap gagal dimuat. Muat ulang halaman.')
    img.src = OVERLAY_SRC
  }, [])

  useEffect(() => {
    const node = previewSlotRef.current
    if (!node) return

    const update = () => {
      const { width, height } = node.getBoundingClientRect()
      const fit = Math.floor(Math.min(width, height, MAX_PREVIEW))
      setPreviewSize(Math.max(MIN_PREVIEW, fit))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [userImage])

  const onFileAccepted = useCallback(async (file: File) => {
    setLoading(true)
    setError('')
    try {
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current)
      }
      const { image, objectUrl } = await loadImageFromFile(file)
      photoUrlRef.current = objectUrl
      setUserImage(image)
      setTransform(DEFAULT_TRANSFORM)
    } catch {
      setError('Gambar tidak bisa dibaca. Coba pilih file lain.')
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPhoto = useCallback(() => {
    if (photoUrlRef.current) {
      URL.revokeObjectURL(photoUrlRef.current)
      photoUrlRef.current = null
    }
    setUserImage(null)
    setTransform(DEFAULT_TRANSFORM)
    setError('')
  }, [])

  const onDownload = useCallback(async () => {
    if (!userImage || !overlayImage) return
    if (!canExportImages()) {
      setError(
        'Browser ini tidak mendukung unduhan gambar. Coba browser terbaru.',
      )
      return
    }

    setExporting(true)
    setError('')
    try {
      const blob = await exportProfilePng(
        userImage,
        overlayImage,
        previewSize,
        transform,
        overlayOpacity,
      )
      downloadBlob(blob, 'asapnya-foto-profil.png')
    } catch {
      setError('Gagal membuat gambar. Coba lagi.')
    } finally {
      setExporting(false)
    }
  }, [userImage, overlayImage, previewSize, transform, overlayOpacity])

  const copyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CAMPAIGN_CAPTION)
      setCaptionCopied(true)
      window.setTimeout(() => setCaptionCopied(false), 2400)
    } catch {
      setError('Gagal menyalin caption.')
    }
  }, [])

  return (
    <div className="editor" id="buat">
      <p id="privacy-notice" className="privacy-notice" role="note">
        Foto diproses di browser — tidak diunggah ke server.
      </p>

      {error ? (
        <div className="banner banner--error" role="alert">{error}</div>
      ) : null}

      <div
        className={`editor-stage${userImage ? ' editor-stage--editing' : ''}`}
        ref={previewSlotRef}
      >
        {!userImage ? (
          <UploadZone
            onFileAccepted={onFileAccepted}
            onError={setError}
            disabled={loading || !overlayImage}
          />
        ) : (
          <ProfilePreview
            userImage={userImage}
            previewSize={previewSize}
            transform={transform}
            overlayOpacity={overlayOpacity}
            onTransformChange={setTransform}
          />
        )}
      </div>

      {userImage ? (
        <div className="editor-toolbar">
          <div className="toolbar-sliders">
            <label className="slider-field">
              <span>Asap</span>
              <input
                type="range"
                min={0.35}
                max={1}
                step={0.01}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                aria-label="Intensitas asap"
              />
            </label>
            <label className="slider-field">
              <span>Zoom</span>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.01}
                value={transform.scale}
                onChange={(e) =>
                  setTransform((t) => ({
                    ...t,
                    scale: Number(e.target.value),
                  }))
                }
                aria-label="Zoom foto"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={onDownload}
              disabled={exporting || !overlayImage}
            >
              {exporting ? 'Menyiapkan…' : 'Unduh'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={copyCaption}
            >
              {captionCopied ? 'Tersalin' : 'Salin caption'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={resetPhoto}
            >
              Ganti foto
            </button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="loading-text" aria-live="polite">Memuat foto…</p>
      ) : null}
    </div>
  )
}
