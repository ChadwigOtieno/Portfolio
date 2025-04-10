import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'

export const metadata: Metadata = {
  title: 'Data Analyst Portfolio',
  description: 'Data visualization expert portfolio',
  generator: 'v0.dev',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
