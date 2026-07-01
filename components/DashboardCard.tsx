// components/DashboardCard.tsx   2026-6-26 ok
export default function DashboardCard({ 
  title, 
  children, 
  variant = 'light' 
}: { 
  title: string, 
  children: React.ReactNode, 
  variant?: 'light' | 'dark' 
}) {
  // 這裡我們重新定義變數：
  // variant="dark" -> 柔和淺藍色系 (bg-blue-50)
  // variant="light" -> 乳白色系 (bg-slate-50 / white)
  const isDark = variant === 'dark';
  
  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${
      isDark 
        ? 'bg-blue-50 text-blue-900 border-blue-100' // 淺藍色板塊
        : 'bg-white text-gray-700 border-gray-100'     // 乳白色/純白板塊
    }`}>
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-blue-800' : 'text-gray-800'}`}>
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}