export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">About Us</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            We are dedicated to redefining the future of water sports. By integrating cutting-edge E-FOIL technology, we seamlessly blend the thrill of flight with the serenity of the ocean. Our mission is to make silent, zero-emission, and high-performance water navigation accessible to everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            From advanced motor engineering to optimized battery systems, we are committed to in-house development to ensure professional-grade durability and performance in every component. Our E-FOILs are more than just sports equipment—they are your ultimate vehicle for ocean exploration.
          </p>
        </section>

        <section className="bg-gray-50 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Proprietary, high-efficiency propulsion systems</li>
            <li>Industry-leading battery technology for extended range</li>
            <li>Rigorous waterproof testing and maritime safety certifications</li>
            <li>Global technical support and after-sales service network</li>
          </ul>
        </section>
      </div>
    </div>
  );
}