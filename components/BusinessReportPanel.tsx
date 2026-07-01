import { getUserRole } from '../lib/auth-utils';

export default async function BusinessReportPanel() {
  // 暫時移除這段檢查，讓組件強制渲染，確保能看到東西
  // const role = await getUserRole();
  // if (role !== 'owner' && role !== 'business') { return null; }

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <h2 className="text-xl font-bold">商務數據指標</h2>
      <p>商務數據內容載入成功！</p>
    </div>
  );
}