import { useRef, useState, useEffect, useCallback } from "react"

export default function useInfinityScroll(onLoadMore: any) {
  const observerRef: { current: IntersectionObserver | null } = useRef(null)
  const containerRef = useRef(null)
  const sentryRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      const id = setTimeout(onLoadMore, 50)

      return () => clearTimeout(id)
    }
  }, [visible, onLoadMore])

  const unobserve = useCallback(() => {
    const currentObserver = observerRef.current
    if (currentObserver) {
      currentObserver.disconnect()
    }
    observerRef.current = null
  }, [])

  const observer = useCallback(() => {
    if (sentryRef.current) {
      let option = {
        root: containerRef.current,
        rootMargin: '0px',
        threshold: 0
      }

      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries

        if (entry?.isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }, option)

      observerRef.current = observer

      observer.observe(sentryRef.current)
    }
  }, [])

  const loadMoreCallback = useCallback(
    (el) => {
      sentryRef.current = el;
      unobserve()
      observer()
    },
    [observer, unobserve]
  )

  const containerRefCallback = useCallback(
    (el) => {
      containerRef.current = el;
      unobserve()
      observer()
    },
    [observer, unobserve]
  )

  return {
    containerRef: containerRefCallback,
    loadMoreRef: loadMoreCallback,
  }
}
