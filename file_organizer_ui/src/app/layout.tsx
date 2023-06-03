import "primereact/resources/primereact.min.css";  
//theme
import "primereact/resources/themes/mira/theme.css";
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'File Organizer',
  description: 'File Organizer UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
