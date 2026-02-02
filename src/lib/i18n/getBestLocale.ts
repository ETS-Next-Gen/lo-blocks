import type { NextRequest } from 'next/server';
import type { RuntimeProps } from '@/lib/types';

/**
 * Select best locale on the server from Accept-Language header.
 *
 * Fails fast if header is missing or availableLocales is empty.
 *
 * @param request - NextRequest with headers
 * @param availableLocales - Array of available BCP 47 locale codes
 * @returns The best matching locale, or first available as fallback
 */
export function getBestLocaleServer(
  request: NextRequest,
  availableLocales: string[]
): string {
  if (!availableLocales || availableLocales.length === 0) {
    throw new Error('getBestLocaleServer: availableLocales cannot be empty');
  }

  const preferredLocale = request.headers.get('accept-language');

  if (preferredLocale && availableLocales.includes(preferredLocale)) {
    return preferredLocale;
  }

  return availableLocales[0];
}

/**
 * Select best locale on the client from Redux.
 *
 * Fails fast if props.runtime.locale is missing.
 *
 * @param props - Component props with runtime.locale.code
 * @param availableLocales - Array of available BCP 47 locale codes
 * @returns The best matching locale, or first available as fallback
 */
export function getBestLocaleClient(
  props: RuntimeProps,
  availableLocales: string[]
): string {
  if (!availableLocales || availableLocales.length === 0) {
    throw new Error('getBestLocaleClient: availableLocales cannot be empty');
  }

  const preferredLocale = props.runtime.locale.code;

  if (preferredLocale && availableLocales.includes(preferredLocale)) {
    return preferredLocale;
  }

  return availableLocales[0];
}
