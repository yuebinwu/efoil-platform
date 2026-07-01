//2026-6-28 建立一個基礎容器，確保所有正式文件都維持一致的邊界與紙張表現：
// components/templates/DocumentBase.tsx
export default function DocumentBase({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="max-w-[210mm] mx-auto p-[20mm] bg-white min-h-[297mm] text-black font-serif print:p-0">
      <header className="flex justify-between border-b-2 border-black pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">E-FOIL INC.</h1>
          <p className="text-sm">123 Silicon Valley Blvd, CA 94025</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase">{title}</h2>
          <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </header>
      <main>{children}</main>
      <footer className="fixed bottom-[20mm] w-[170mm] border-t border-gray-300 pt-4 text-[10px] text-gray-500">
        This document is an official record of E-Foil Inc. Authenticity can be verified via UID.
      </footer>
    </div>
  );
}