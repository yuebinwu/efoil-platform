//InvoiceTemplate.tsx
'use client';
import React from 'react'; // 标记为客户端组件，因为使用了 window.print() 和动态日期处理
import DocumentHeader from '../DocumentHeader'; // 复用通用的文档头部组件，在components

// 导出这些接口供其他页面使用
// ==========================================
// 1. 类型定义 (Type Definitions)
// ==========================================

/**
 * InvoiceItem - 发票商品明细接口
 * 支持多种价格字段以兼容不同后端数据结构
 */
export interface InvoiceItem {  // 使用items数据结构json键值对
  name: string;                 // 商品名称
  price?: number;               // 总价或单价（优先使用）
  unit_price?: number;          // 备用单价字段
  model?: string;               // 型号
  uid?: string;                 // 商品唯一标识符
}

/**
 * ProfileData - 客户/收件人信息接口
 */
export interface ProfileData {
  full_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  remarks?: string;               // 备注信息
}
/**
 * InvoiceData - 发票主数据结构---调用上面两个数据接口类型
 * items 字段设计为联合类型，兼容 JSON 字符串或已解析数组
 */
export interface InvoiceData {
  id: string;                         // 发票ID
  created_at: string;                 // 创建时间
  unit_price: string;
  items: InvoiceItem[] | string;
  profiles?: ProfileData;
}

// ==========================================
// 2. 组件主体
// ==========================================
export default function InvoiceTemplate({ data }: { data: InvoiceData }) {
  // 稳健的 Items 解析逻辑
   /**
   * 【数据解析逻辑】
   * 目标：将 data.items 统一转换为 InvoiceItem[] 数组，防止渲染崩溃。
   */
  console.log("=== Invoice Data Debug ===");
  console.log("Full Data:", data);
  console.log("Profiles:", data.profiles);
  console.log("Raw Items:", data.items);
  console.log("Type of Items:", typeof data.items);
  
  //let itemsArray: InvoiceItem[] = [];
  //try {
    // 1. 判断是否为字符串，如果是则解析 JSON
  //  const rawItems = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    // 2. 形态归一化：确保结果是数组
  //  itemsArray = Array.isArray(rawItems) ? rawItems : (rawItems ? [rawItems] : []);
  //} catch {
     // 3. 异常处理：JSON 解析失败时返回空数组，保证页面可渲染
  //  itemsArray = [];
  //}
  // 替换原有的 itemsArray 解析逻辑
  let itemsArray: InvoiceItem[] = [];
  try {
    // 核心逻辑：确保 data.items 被正确转化为数组
    if (data.items) {
      if (typeof data.items === 'string') {
        itemsArray = JSON.parse(data.items);
      } else if (Array.isArray(data.items)) {
        itemsArray = data.items;
      } else {
        // 处理像 image_ac5032.png 那样是一个 Object 的情况
        itemsArray = [data.items as InvoiceItem];
      }
    }
  } catch {
    itemsArray = [];
  }

  // 计算逻辑
  /**
   * 【财务计算逻辑】
   * 计算小计、税费和总计
   */
  // 累加所有商品的价格。优先取 price，其次取 unit_price，默认为 0
  //const subtotal = itemsArray.reduce((acc: number, item: InvoiceItem) => 
  //  acc + (Number(item.price || item.unit_price || 0)), 0
  //);

  // 财务计算逻辑（确保使用 unit_price）
  //  const subtotal = itemsArray.reduce((acc: number, item: InvoiceItem) => {
  //    console.log("正在计算这一项:", item);
      // 明确优先使用 unit_price
  //    const price = Number(item.unit_price) || Number(item.price) || 0;
  //    return acc + price;
  //  }, 0);
  // 1. 如果价格是整个订单共用的，或者直接存储在 data 对象中
const unitPrice = Number(data.unit_price) || 0; // 假设数据在 data 根目录下
const subtotal = unitPrice; // 或者根据业务逻辑进行调整
  
  const tax = subtotal * 0.08;                 // 假设税率为 8%  
  const grandTotal = subtotal + tax;


  console.log("=== 最终检查 ===", { itemsArray, subtotal, grandTotal });
  // 解构客户信息，提供默认空对象防止 undefined 错误
  const p = data.profiles || {}; 
console.log("渲染前 itemsArray:", itemsArray);
  // ==========================================
  // 3. UI 渲染结构
  // ==========================================
  return (
    // &zwnj;**主容器**&zwnj;
    // p-12: 内边距，模拟页边距
    // max-w-4xl: 限制最大宽度，保持阅读舒适度
    // min-h-[297mm]: 最小高度设为 A4 纸高度，确保单页视觉效果
    // font-serif: 使用衬线字体，符合正式票据风格
    <div className="p-12 max-w-4xl mx-auto bg-white min-h-[297mm] font-serif">
      {/* &zwnj;**页眉**&zwnj; */}
      {/* 传入标题 "INVOICE" 和截断后的发票ID作为参考号 */}
      <DocumentHeader title="INVOICE" refNumber={data.id?.slice(0, 8) || 'N/A'} />
      {/* &zwnj;**客户信息区 (Bill To)**&zwnj; */}
      <div className="mb-10 mt-8">
        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">BILL TO</h3>
        {/* 显示客户姓名，若无则显示默认值 */}
        <div className="text-lg space-y-1">
          <p className="font-bold">{p.full_name || 'Valued Customer'}</p>
          {/* 地址拼接逻辑：若存在街道地址，则拼接城市、州和邮编；否则提示未提供 */}
          <p>
            {p.street_address 
              ? `${p.street_address}, ${p.city || ''}, ${p.state || ''} ${p.postal_code || ''}` 
              : 'Address not provided'}
          </p>
          {/* 电话号码 */}
          <p className="text-sm text-gray-600">Tel: {p.phone || 'N/A'}</p>
          {/* 备注信息：仅当存在 remarks 时才渲染 */}
          {p.remarks && (
            <p className="text-sm italic text-gray-500 mt-2">Remarks: {p.remarks}</p>
          )}
        </div>
      </div>
          {/* &zwnj;**商品明细表格**&zwnj; */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="py-2">Product Name</th>
            <th className="py-2">Model</th>
            <th className="py-2">UID</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {itemsArray.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              
              <td className="py-3">{item.name}</td>
              <td className="py-3">{item.model || '-'}</td>
              <td className="py-3">{item.uid || '-'}</td>
              <td className="py-3 text-right">${item.uid}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-right">
          
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Tax (8%): ${tax.toFixed(2)}</div>
        

          <p className="text-xl font-bold border-t border-black pt-2">Total: ${grandTotal.toFixed(2)}</p>
        </div>
      </div>

      <button 
        onClick={() => window.print()} 
        className="mt-10 bg-black text-white px-6 py-2 print:hidden rounded font-bold hover:bg-gray-800"
      >
        Print Invoice
      </button>
    </div>
  );
}