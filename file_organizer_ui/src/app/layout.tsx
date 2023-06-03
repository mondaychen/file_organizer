import "primereact/resources/primereact.min.css";  
//theme
import "primereact/resources/themes/mira/theme.css";
import 'primeicons/primeicons.css';
import './globals.css';

export const metadata = {
  title: 'File Organizer',
  description: 'File Organizer UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
