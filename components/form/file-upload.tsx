'use client'

import { Button } from '@/components/ui/button'
import { VideoAutoplay } from '@/components/video-autoplay'
import { Icons } from '@/lib/constants/icons'
import { ALLOWED_MEDIA_TYPES, formatToExtension, type MediaType } from '@/lib/constants/media'
import { paths } from '@/lib/constants/paths'
import { useApiRoutes } from '@/lib/hooks/use-api-routes'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { match } from 'ts-pattern'
import { Icon } from '../ui/icon'
import { FileUploadAudio } from './file-upload-audio'

interface FileUploadProps {
  value?: string
  onChange: (url?: string) => void
  maxSizeMB?: number
  media: MediaType
  disabled?: boolean
  onDisabled?: (disabled: boolean) => void
}

function getPreviewComponent(media: MediaType, url: string) {
  return match(media)
    .with('image', () => (
      <Image
        src={url}
        alt="Uploaded file"
        width={500}
        height={500}
        className="absolute inset-0 h-full w-full object-cover"
        unoptimized
      />
    ))
    .with('video', () => <VideoAutoplay src={url} className="absolute inset-0 h-full w-full object-cover" />)
    .with('audio', () => <audio src={url} controls className="h-[50px] w-full max-w-[275px]" />)
    .otherwise(() => <div>No preview available.</div>)
}

export const FileUpload = ({
  value,
  onChange,
  maxSizeMB = 10,
  media = 'image',
  disabled,
  onDisabled,
}: FileUploadProps) => {
  const [url, setUrl] = React.useState<string>(value || '')
  const [file, setFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const id = React.useId()

  const { actions, loading: uploading } = useApiRoutes([
    {
      name: 'upload',
      method: 'POST',
      endpoint: paths.api.upload,
      stringify: false,
    },
  ])

  const onFileChange = async (newFiles: File[]) => {
    const newFile = newFiles[0]

    if (!newFile) return

    if (maxSizeMB && newFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds the ${maxSizeMB} MB limit.`)
      return
    }

    if (!ALLOWED_MEDIA_TYPES[media].includes(newFile.type)) {
      toast.error(`Invalid file type. Please upload a ${media}.`)
      return
    }

    setFile(newFile)
    await onUpload(newFile)
  }

  const onUpload = async (newFile: File) => {
    const formData = new FormData()
    formData.append('file', newFile)

    try {
      const url = await actions.upload<string>(formData)
      onChange(url)
      setUrl(url)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unknown error occurred.')
    }
  }

  const handleClick = () => {
    if (disabled || uploading) return
    fileInputRef.current?.click()
  }

  const remove = () => {
    onChange('')
    setFile(null)
    setUrl('')
  }

  const { getRootProps } = useDropzone({
    multiple: false,
    noClick: true,
    disabled: uploading || disabled,
    onDrop: onFileChange,
    onDropRejected: (error) => {
      console.log(error)
    },
  })

  React.useEffect(() => {
    setUrl(value || '')
  }, [value])

  React.useEffect(() => {
    if (onDisabled) {
      onDisabled(disabled || uploading)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploading, disabled])

  if (media === 'audio') {
    return (
      <FileUploadAudio
        onClick={handleClick}
        onRemove={remove}
        url={url}
        uploading={uploading}
        disabled={disabled}
        fileInputRef={fileInputRef}
        handleFileChange={onFileChange}
      />
    )
  }

  return (
    <div className="w-full space-y-2" {...getRootProps()}>
      <div
        onClick={handleClick}
        className={cn(
          'group/file border-foreground/20 bg-tertiary relative block w-full overflow-hidden rounded-xl border-2 border-dashed p-4 duration-300',
          disabled || uploading ? 'cursor-not-allowed opacity-50' : 'hover:border-foreground cursor-pointer',
        )}
      >
        {uploading && (
          <div className="bg-background/50 absolute inset-0 z-20 flex items-center justify-center rounded-xl backdrop-blur-xl">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="text-primary-500 h-6 w-6 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span className="text-xs text-white">Uploading…</span>
            </div>
          </div>
        )}
        {url ? (
          <div className="flex h-32 items-center justify-center">
            <div className="absolute top-2 right-2 z-10">
              <Button type="button" onClick={remove} variant="black-blur" size="icon-sm" className="text-destructive">
                <Icons.trash className="text-destructive size-4" />
              </Button>
            </div>
            {getPreviewComponent(media, url)}
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              id={`file-upload-handle-${id}`}
              type="file"
              onChange={(e) => onFileChange(Array.from(e.target.files || []))}
              className="hidden"
              accept={ALLOWED_MEDIA_TYPES[media].join(',')}
              disabled={uploading || disabled}
            />
            <div className="flex h-32 w-full flex-col items-center justify-center">
              <Icon name="uil:file-upload-alt" className="text-foreground mb-2 size-11 shrink-0" />
              <div className="text-foreground text-center text-sm">
                Drag and drop file here or <span className="text-primary-500 font-medium">Choose File</span>
              </div>
              <div className="text-muted-foreground mt-2 text-xs">
                {ALLOWED_MEDIA_TYPES[media].map(formatToExtension).join(', ')}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
