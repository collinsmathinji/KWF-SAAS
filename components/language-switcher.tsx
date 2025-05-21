"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,es,de,it,pt,ru,zh-CN,ja,ko', // Add more languages as needed
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    return () => {
      // Cleanup
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="hidden" />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (select) {
            select.click();
          }
        }}
      >
        <Globe className="h-4 w-4" />
        <span className="sr-only">Translate page</span>
      </Button>
    </div>
  );
} 