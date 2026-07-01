// components/OwnerDashboardPanel.tsx
export default function OwnerDashboardPanel() {
  return (
    // 使用深藍色調，既有專業感又不會像死黑那麼強烈
    <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold mb-4 opacity-90">財務總覽 (全局)</h2>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-blue-200 text-sm">年度預算執行率</p>
          <p className="text-4xl font-black mt-1">88.5%</p>
        </div>
        <button className="text-xs bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
          查看報表
        </button>
      </div>
    </div>
  );
}