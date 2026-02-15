import './globals.css';

export const metadata = {
  title: 'Product Inventory Manager — QA Testing App',
  description: 'A Product Inventory Manager application built for QA Testing practice — UI, API, and SQL testing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
