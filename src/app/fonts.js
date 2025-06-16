import localFont from 'next/font/local';

export const geistSans = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const geistMono = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
});
