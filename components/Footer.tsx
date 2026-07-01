// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
        <div>
          <h4 className="font-bold mb-4">關於 E-FOIL</h4>
          <p className="text-gray-400">專注於極致的水上飛行體驗與碳纖維創新。</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">支援</h4>
          <p className="text-gray-400">技術指導 / 售後維修 / 常見問題</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">聯絡我們</h4>
          <p className="text-gray-400">support@efoil.com</p>
        </div>
      </div>
      <div className="text-center mt-12 text-gray-500 text-xs border-t border-gray-800 pt-8">
        © 2026 E-Foil Platform. All Rights Reserved.
      </div>
    </footer>
  );
}