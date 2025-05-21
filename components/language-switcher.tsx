"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const [showWidget, setShowWidget] = useState(false)
  const widgetLoaded = useRef(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!showWidget || widgetLoaded.current) return

    // Add Google Translate script only once
    const script = document.createElement("script")
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    document.body.appendChild(script)

    window.googleTranslateElementInit = function () {
      if (widgetLoaded.current) return
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,fr,es,de,it,pt,ru,zh-CN,ja,ko",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, "google_translate_element")
      widgetLoaded.current = true
    }

    // Listen for language selection and hide widget after selection
    const observer = new MutationObserver(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        select.onchange = () => setTimeout(() => setShowWidget(false), 500)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.body.removeChild(script)
      delete window.googleTranslateElementInit
      observer.disconnect()
      widgetLoaded.current = false
      const widget = document.getElementById("google_translate_element")
      if (widget) widget.innerHTML = ""
    }
  }, [showWidget])

  // Hide branding and style the widget after it loads
  useEffect(() => {
    if (!showWidget) return
    const interval = setInterval(() => {
      const frame = document.querySelector('iframe.goog-te-banner-frame')
      if (frame) frame.style.display = 'none'
      const googLogo = document.querySelector('.goog-logo-link')
      if (googLogo) (googLogo as HTMLElement).style.display = 'none'
      const googPowered = document.querySelector('.goog-te-gadget span')
      if (googPowered) (googPowered as HTMLElement).style.display = 'none'
      const combo = document.querySelector('.goog-te-combo')
      if (combo) {
        (combo as HTMLElement).style.width = '100%'
        (combo as HTMLElement).style.padding = '8px'
        (combo as HTMLElement).style.borderRadius = '6px'
        (combo as HTMLElement).style.border = '1px solid #e5e7eb'
        (combo as HTMLElement).style.fontSize = '1rem'
      }
    }, 100)
    return () => clearInterval(interval)
  }, [showWidget])

  // Close dropdown on outside click
  useEffect(() => {
    if (!showWidget) return
    function handleClick(e: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !(document.getElementById('google_translate_element')?.contains(e.target as Node))
      ) {
        setShowWidget(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showWidget])

  return (
    <div className="relative flex items-center gap-2">
      <Button
        ref={buttonRef}
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setShowWidget((v) => !v)}
      >
        <Globe className="h-4 w-4" />
        <span className="sr-only">Translate page</span>
      </Button>
      {showWidget && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" style={{ background: 'transparent' }} />
          {/* Dropdown */}
          <div
            id="google_translate_element"
            className="absolute left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border w-48 p-2"
            style={{ minWidth: 180 }}
          />
        </>
      )}
    </div>
  )
} 