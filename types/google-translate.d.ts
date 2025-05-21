interface Window {
  googleTranslateElementInit?: () => void;
  google: {
    translate: {
      TranslateElement: {
        new (options: {
          pageLanguage: string;
          includedLanguages: string;
          layout: number;
          autoDisplay: boolean;
        }, elementId: string): void;
        InlineLayout: {
          SIMPLE: number;
        };
      };
    };
  };
} 