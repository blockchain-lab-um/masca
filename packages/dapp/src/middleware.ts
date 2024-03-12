import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    // A list of all locales that are supported
    locales: ['en'],

    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: 'en',
    localePrefix: 'as-needed',
  });

  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
