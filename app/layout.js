import './globals.css';

export const metadata = {
  title: 'Foodica Sales Person Analytics Dashboard',
  description: 'Foodica sales person analytics dashboard',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
