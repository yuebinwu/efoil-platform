// 修改前：import './globals.css';
// 修改後 (使用 @ 別名)
import '@/app/globals.css';

import Header from '@/components/Header'; // 確保路徑正確
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <Header /> {/* 全域 Header */}
        <main className="min-h-screen">
          {children} {/* 所有 page.tsx 的內容都會被放進這裡 */}
        </main>
        <Footer /> {/* 全域 Footer */}
      </body>
    </html>
  );
}