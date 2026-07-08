import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-black text-white p-10">
      <div className="flex gap-6 items-center">
        <span>聯絡我們：</span>
        
        {/* 邮箱 */}
        <a href="mailto:certmapsy@gmail.com" className="hover:text-blue-400">
          <MdEmail className="w-6 h-6" />
        </a>

        {/* Facebook */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
          <FaFacebook className="w-6 h-6" />
        </a>

        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
          <FaInstagram className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
}