import { createClient } from '@/lib/supabase-server'; 
import Link from 'next/link';

// 定义明确的产品接口，消除类型警告
interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  quantity: number;
  price: number;
  description?: string;
}

export default async function MotorDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 获取所有同名电机记录
  const { data: motors, error } = await supabase
    .from('products')
    .select('*')
    .eq('name', decodeURIComponent(slug));

  if (error || !motors || motors.length === 0) {
    return <div className="p-10 text-center text-red-500">找不到電機或資料讀取錯誤</div>;
  }

  // 核心逻辑：只统计 status 为 'available' 的库存，严谨计算
  const totalAvailableQuantity = motors.reduce((sum: number, motor: Product) => {
    return motor.status === 'available' ? sum + (motor.quantity || 0) : sum;
  }, 0);

  const motor = motors[0];
  const { data: imageData } = supabase.storage
    .from('product-images')
    .getPublicUrl(`public/${motor.name}.jpg`);

  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* 左侧：图片 */}
      <div>
        <img src={imageData.publicUrl} alt={motor.name} className="w-full rounded-lg shadow-lg" />
      </div>

      {/* 右侧：统一的5项信息 */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold mb-4">{motor.name}</h1>
        <p className="text-gray-600 mb-6">{motor.description || "暫無詳細描述"}</p>
        
        {/* 精准库存显示 */}
        <div className="text-xl mb-4 font-semibold text-gray-800">
           庫存數量: {totalAvailableQuantity > 0 ? totalAvailableQuantity : <span className="text-red-500">已售罄</span>}
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-6">
            價格: ${motor.price || "請諮詢"}
        </div>
        
        {/* 统一跳转到 /checkout 页面 */}
        {totalAvailableQuantity > 0 ? (
          <Link 
            href={`/checkout?product=${encodeURIComponent(motor.name)}`} 
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-center"
          >
            立即購買
          </Link>
        ) : (
          <button disabled className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed">
            已售罄
          </button>
        )}
      </div>
    </div>
  );
}