import { useCallback, useRef, useState, type DragEvent } from 'react'
import { ACCEPTED_EXTENSIONS_LABEL } from '../lib/constants'
import { validateImageFile } from '../lib/validateImage'

type UploadZoneProps = {
  onFileAccepted: (file: File) => void
  onError: (message: string) => void
  disabled?: boolean
}

export function UploadZone({
  onFileAccepted,
  onError,
  disabled,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      const result = validateImageFile(file)
      if (!result.ok) {
        onError(result.message)
        return
      }
      onError('')
      onFileAccepted(file)
    },
    [onFileAccepted, onError],
  )

  const onInputChange = useCallback(() => {
    const file = inputRef.current?.files?.[0]
    handleFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }, [handleFile])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      setDragOver(false)
      if (disabled) return
      const file = event.dataTransfer.files[0]
      handleFile(file)
    },
    [disabled, handleFile],
  )

  return (
    <div
      className={`upload-zone${dragOver ? ' upload-zone--active' : ''}${disabled ? ' upload-zone--disabled' : ''}`}
      onDragEnter={(e) => {
        e.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDragOver(false)
      }}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        id="photo-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="upload-input"
        onChange={onInputChange}
        disabled={disabled}
        aria-describedby="upload-hint privacy-notice"
      />
      <label htmlFor="photo-upload" className="upload-label">
        <span className="upload-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0 7 7m-7-7L5 11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="upload-title">Pilih foto atau seret ke sini</span>
        <span id="upload-hint" className="upload-hint">
          {ACCEPTED_EXTENSIONS_LABEL} · maks. 10 MB
        </span>
      </label>
    </div>
  )
}
