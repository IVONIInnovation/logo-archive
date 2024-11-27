import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk, Roboto_Mono } from 'next/font/google';
import './globals.css';

// Replace Inter with our fonts
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta-sans',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-space-grotesk',
});

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Digital Card - KSwanborough',
  description: 'kaiswanborough.com',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
