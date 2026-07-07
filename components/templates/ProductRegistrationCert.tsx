'use client';
import DocumentHeader from '../DocumentHeader';

// --- 类型定义 (Types Definition) ---
export interface ProductInfo {
  name: string;
  serial_no: string;
}

export interface OwnerInfo {
  full_name: string;
  address: string;
}

export interface TransferRecord {
  date: string;
  assignee: string;
}

export interface RepairRecord {
  date: string;
  issue: string;
  technician: string;
}

export interface CertificateData {
  uid: string;
  product: ProductInfo;
  owner: OwnerInfo;
  transfers: TransferRecord[];
  repairs: RepairRecord[];
}

export interface CertProps {
  data: CertificateData;
}

// --- 组件实现 (Component Implementation) ---
export default function ProductRegistrationCert({ data }: CertProps) {
  return (
    <div className="p-10 max-w-[210mm] mx-auto bg-white min-h-[297mm] font-serif border border-gray-300 shadow-lg print:border-none print:shadow-none">
      {/* 头部：证书名称与 UID */}
      <DocumentHeader title="PRODUCT REGISTRATION CERTIFICATE" refNumber={data.uid} />

      <div className="mt-8 space-y-6">
        {/* 1. 产品信息 */}
        <section className="border border-black p-4">
          <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">1. Product Specifications</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Model Name:</strong> {data.product.name}</p>
            <p><strong>Serial/UID:</strong> {data.uid}</p>
          </div>
        </section>

        {/* 2. 产权人信息 */}
        <section className="border border-black p-4">
          <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">2. Registered Owner</h3>
          <div className="text-sm">
            <p><strong>Full Name:</strong> {data.owner.full_name}</p>
            <p><strong>Address:</strong> {data.owner.address}</p>
          </div>
        </section>

        {/* 3. 转让记录 */}
        <section className="border border-black p-4">
          <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">3. Transfer Record</h3>
          {data.transfers.length > 0 ? (
            <ul className="text-sm list-disc pl-5">
              {data.transfers.map((t, i) => (
                <li key={i}>{t.date}: Transferred to {t.assignee}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-sm">No transfer records found.</p>
          )}
        </section>

        {/* 4. 维修记录 */}
        <section className="border border-black p-4">
          <h3 className="font-bold border-b border-black mb-2 uppercase text-sm">4. Repair Log</h3>
          {data.repairs.length > 0 ? (
            <ul className="text-sm list-disc pl-5">
              {data.repairs.map((r, i) => (
                <li key={i}>{r.date} - Issue: {r.issue} (Technician: {r.technician})</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-sm">No repair records found.</p>
          )}
        </section>
      </div>

      {/* 底部：签名区与打印按钮 */}
      <div className="mt-16 flex justify-between items-end border-t border-black pt-4">
        <div className="text-xs">
          <p>Authorized Official Signature</p>
          <div className="mt-8 w-48 border-b border-black"></div>
        </div>
        <button 
          onClick={() => window.print()} 
          className="bg-black text-white px-6 py-2 print:hidden rounded hover:bg-gray-800 transition-colors"
        >
          Print Certificate
        </button>
      </div>
    </div>
  );
}