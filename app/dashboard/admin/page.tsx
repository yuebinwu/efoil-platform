// app/dashboard/admin/page.tsx，所有用户操作基于dashboard   2026-6-28 調試成功--跳轉--填寫--成功
'use client';

// 為了排除組件引用錯誤，我們直接在這裡定義測試組件，在管理者层级，可以看到三个部门，没有链接到具体地址
const TestTechnician = () => <div style={{border: '2px solid red', padding: '10px'}}>【技術部區域內容】</div>;
const TestBusiness = () => <div style={{border: '2px solid green', padding: '10px'}}>【商務部區域內容】</div>;
const TestOwner = () => <div style={{border: '2px solid blue', padding: '10px'}}>【董事會區域內容】</div>;

export default function AdminRepairsPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">管理員控制面板 (暴力測試版)</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold">技術部面板</h2>
          <TestTechnician />
        </section>
        
        <section>
          <h2 className="text-xl font-bold">商務部面板</h2>
          <TestBusiness />
        </section>
        
        <section>
          <h2 className="text-xl font-bold">董事會面板</h2>
          <TestOwner />
        </section>
      </div>
    </div>
  );
}