import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import type React from 'react';
import AuthProvider from './AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "KWF_SAAS- Organization Management Made Easy",
  description: "Streamline your organization operations with KWF_SAAS",
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export default async function LocaleLayout(props: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  const { children } = props;
  const params = await props.params;
  const { locale } = params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/_next/static/css/103f38bd7c3a1a72.css"
          as="style"
        />
        <link
          rel="preload"
          href="/_next/static/css/a979edae68e19a68.css"
          as="style"
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}