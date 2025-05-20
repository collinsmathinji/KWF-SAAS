import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // If no locale is provided, use the default locale
  if (!locale) {
    locale = defaultLocale;
  }

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.warn(`Invalid locale "${locale}", falling back to "${defaultLocale}"`);
    locale = defaultLocale;
  }

  try {
    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
      timeZone: 'UTC'
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error);
    // Fallback to default locale if messages can't be loaded
    if (locale !== defaultLocale) {
      return {
        locale: defaultLocale,
        messages: (await import(`../messages/${defaultLocale}.json`)).default,
        timeZone: 'UTC'
      };
    }
    throw error;
  }
}); 