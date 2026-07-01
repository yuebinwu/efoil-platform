// app/print-center/layout.tsx
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen">
      {children}
    </div>
  );
}