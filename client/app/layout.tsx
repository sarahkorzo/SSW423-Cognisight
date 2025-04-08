import type { Metadata } from 'next'
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"

import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster /> {/*This enables toast popups */}
        </AuthProvider>
      </body>
    </html>
  )
}
