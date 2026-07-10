import { FaFacebook, FaInstagram, FaYoutube, FaVimeoV } from 'react-icons/fa';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Resources Section */}
        <div>
          <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">Resources</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link href="/catalogs" className="hover:text-white">Catalogs</Link>
            <Link href="/manuals" className="hover:text-white">User Manuals</Link>
            <Link href="/archive" className="hover:text-white">Archived Products</Link>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">Support</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/help" className="hover:text-white">Help Center</Link>
            <Link href="/after-sales" className="hover:text-white">After-sales Service</Link>
            
          </div>
        </div>

        {/* Community Section */}
        <div>
          <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">Join the Community</h3>
          <div className="flex gap-4 text-gray-400">
            <a 
              href="https://www.facebook.com/profile.php?id=61563005446832" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white"
            >
              <FaFacebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-white"><FaInstagram size={20} /></a>
            <a href="https://youtube.com" target="_blank" className="hover:text-white"><FaYoutube size={20} /></a>
            <a href="https://vimeo.com" target="_blank" className="hover:text-white"><FaVimeoV size={20} /></a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div>
          <h3 className="font-bold mb-4 uppercase tracking-wider text-sm">Newsletter</h3>
          {/* 这里整合了你的邮箱 */}
          <p className="text-xs text-gray-400 mb-2">Inquiries: certmapsys@gmail.com</p>
          <p className="text-xs text-gray-400 mb-4">Get exclusive news about products & events.</p>
          <button className="bg-white text-black px-6 py-2 text-sm font-bold uppercase hover:bg-gray-200 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto text-center pt-8 border-t border-gray-800 text-[10px] text-gray-600 uppercase tracking-widest">
        © {currentYear} certmapsys Technology. All rights reserved.
      </div>
    </footer>
  );
}