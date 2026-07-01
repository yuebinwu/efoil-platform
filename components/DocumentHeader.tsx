// components/DocumentHeader.tsx
export default function DocumentHeader({ title, refNumber }: { title: string, refNumber: string }) {
  return (
    <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
      <div>
        <h1 className="text-3xl font-bold">E-FOIL INC.</h1>
        <p className="text-sm text-gray-700">123 Silicon Valley Blvd, CA 94025</p>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold uppercase">{title}</h2>
        <p className="text-sm font-semibold">REF: {refNumber}</p>
        <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}