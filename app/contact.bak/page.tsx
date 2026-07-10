export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">Contact</h1>
      
      <p className="text-sm text-gray-600 text-center mb-10">
        For any urgent questions regarding gear or after-sales requests, please contact your shop directly.
      </p>

      <form className="space-y-6">
        <p className="text-xs text-gray-500 text-center">(*) Required fields</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" required />
          <Input label="Last Name" required />
        </div>
        
        <Input label="E-mail" type="email" required />
        <Input label="Country" required />
        <Input label="Subject" required />

        <div>
          <label className="block text-sm font-semibold mb-2">Receiver *</label>
          <select className="w-full border border-gray-300 p-3 bg-white focus:ring-1 focus:ring-black outline-none">
            <option>Marketing & communication</option>
            <option>After-sales support</option>
            <option>General inquiry</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea className="w-full border border-gray-300 p-3 h-48 focus:ring-1 focus:ring-black outline-none" />
        </div>

        <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition">
          Send
        </button>
      </form>
    </div>
  );
}

// 辅助组件，简化代码
function Input({ label, type = "text", required = false }: { label: string, type?: string, required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} className="w-full border border-gray-300 p-3 focus:ring-1 focus:ring-black outline-none" />
    </div>
  );
}