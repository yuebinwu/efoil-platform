import { createClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data } = supabase.storage
    .from('product-images') 
    .getPublicUrl('public/web-page-v260611.jpg');

  const imageUrl = data.publicUrl;

  return (
    <div className="flex flex-col gap-12 py-8 px-4 max-w-6xl mx-auto">
          
      {/* Hero Section */}
      <section className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={imageUrl} 
          alt="E-FOIL Hero" 
          className="w-full h-full object-cover" 
        />
      </section>

      {/* Introduction */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Professional Electric Hydrofoil</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the future of water sports. We engineer high-performance E-FOILs that blend cutting-edge technology with the beauty of the ocean.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 p-8 rounded-xl border border-gray-100 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          
          <details className="group bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
              Q: Is there a warranty included?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 border-t pt-4">
              A: Yes, we provide a one-year limited warranty on all systems, backed by our professional support team.
            </p>
          </details>

          <details className="group bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
              Q: How do I transfer ownership?
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 border-t pt-4">
              A: Simply log in to your account, navigate to My Orders, and initiate a digital transfer request for your specific unit.
            </p>
          </details>

        </div>
      </section>
      
    </div>
  );
}