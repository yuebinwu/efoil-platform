export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">關於我們</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">品牌理念</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            我們致力於重塑水上運動的未來。透過尖端的 E-FOIL 技術，將飛行的快感與海洋的寧靜完美結合。我們的目標是讓每個人都能享受到無排放、靜音且高效的水上航行體驗。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">我們的使命</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            **從電機研發到電池系統的優化，我們堅持自主開發，確保每一個組件都能達到專業級的耐用度與性能。E-FOIL 不僅是一項運動器材，更是你探索海洋的全新載具。
          </p>
        </section>

        <section className="bg-gray-50 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">為什麼選擇我們？</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>自主研發的高效推進系統</li>
            <li>領先業界的長續航電池技術</li>
            <li>嚴格的防水測試與航行安全認證</li>
            <li>全球化的售後技術支援網絡</li>
          </ul>
        </section>
      </div>
    </div>
  );
}