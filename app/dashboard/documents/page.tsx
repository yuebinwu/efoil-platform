import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function DocumentsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Technical Documents</h1>

      {/* 1. User Profile Section */}
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-2">Account Profile</h2>
        
        {/* <p><strong>Name:</strong> {user?.user_metadata?.full_name || 'User'}</p> */}
        <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
      </div>

      {/* 2. Technical Documents List */}
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="font-bold text-xl mb-4">Manuals & Technical Guides</h2>
        <p className="text-gray-600 mb-6">Download technical documentation related to your equipment below.</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
            <span>E-Foil Cruiser V2 User Manual</span>
            <button className="text-blue-600 font-bold hover:underline">Download PDF</button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
            <span>High-Performance Battery Safety & Maintenance Guide</span>
            <button className="text-blue-600 font-bold hover:underline">Download PDF</button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
            <span>Standard Mast Installation Specifications</span>
            <button className="text-blue-600 font-bold hover:underline">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}