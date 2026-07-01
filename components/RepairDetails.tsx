// components/RepairDetails.tsx
export default function RepairDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold text-gray-500">產品名稱</h3>
          <p>{data.product_name}</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-500">維修狀態</h3>
          <p className="text-blue-600 font-semibold">{data.status}</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-bold text-gray-500">故障描述</h3>
        <p className="bg-gray-50 p-4 rounded-lg">{data.description || '無描述'}</p>
      </div>
    </div>
  );
}