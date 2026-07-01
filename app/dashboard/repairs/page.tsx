// app/dashboard/repairs/page.tsx
import { redirect } from 'next/navigation';

export default function RepairsPage() {
  // 將用戶直接引導至查詢頁
  redirect('/dashboard/repairs/query');
}