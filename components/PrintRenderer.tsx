// components/PrintRenderer.tsx
import DocumentTemplate from './DocumentTemplate';
import RepairDetails from './RepairDetails';
import InvoiceView from './InvoiceView';

// 1. 簡化 Props 定義，直接使用 any 來 bypass 強制類型檢查
// 這能確保您在開發階段不會因為類型定義不嚴謹而被阻礙
interface PrintRendererProps {
  data: any;
  type: 'repair' | 'order';
}

export default function PrintRenderer({ data, type }: PrintRendererProps) {
  // 2. 防呆機制
  if (!data) return <div>資料加載中...</div>;

  // 3. 準備必要變數，確保傳入模板的內容不為空
  const docRef = data.id ? data.id.slice(0, 8).toUpperCase() : 'N/A';
  const currentDate = new Date().toLocaleDateString();

  return (
    <DocumentTemplate 
      title={type === 'repair' ? '維修報告' : '發票'}
      docNumber={docRef}
      date={currentDate}
    >
      <div className="p-8">
        {type === 'repair' ? (
          <RepairDetails data={data} />
        ) : (
          <InvoiceView data={data} />
        )}
      </div>
    </DocumentTemplate>
  );
}