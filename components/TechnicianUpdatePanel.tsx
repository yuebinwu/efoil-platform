export default function TechnicianUpdatePanel() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-6 bg-green-500 rounded-full mr-2"></span>
        技術工單管理
      </h2>
      <div className="space-y-3">
        {/* 單一工單項目 */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="font-mono text-sm">#29019A10</span>
          <select className="text-sm p-1 border rounded bg-white">
            <option>待處理</option>
            <option>維修中</option>
            <option>已完成</option>
          </select>
        </div>
      </div>
    </div>
  );
}