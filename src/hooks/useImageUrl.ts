import { useEffect, useState } from 'react'
import { getImageBlobUrl, isIdbRef } from '@/lib/imageStore'

export function useImageUrl(src?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() => (src && !isIdbRef(src) ? src : null))

  useEffect(() => {
    if (!src) {
      setUrl(null)
      return
    }
    if (!isIdbRef(src)) {
      setUrl(src)
      return
    }
    let revoked: string | null = null
    let cancelled = false
    getImageBlobUrl(src).then((blobUrl) => {
      if (cancelled) {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        return
      }
      if (blobUrl) {
        revoked = blobUrl
        setUrl(blobUrl)
      } else {
        setUrl(null)
      }
    })
    return () => {
      cancelled = true
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [src])

  return url
}
