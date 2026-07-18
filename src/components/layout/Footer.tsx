import Link from 'next/link';

export default function Footer({ contacts }: { contacts?: any }) {
  const c = contacts || {
    phone: '+38 098 0751707',
    email: 'komarnytskiy.yura@gmail.com',
    address: '82400, м. Стрий, вул. Народна, 8',
    telegram: 'https://t.me/3d_print',
    whatsapp: 'https://wa.me/380980751707',
    instagram: 'https://instagram.com/3d_print_ua',
  };

  return (
    <footer className="bg-[#1a3c34] border-t border-[#c9a84c]/20 py-16 text-white">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Бренд */}
        <div>
          <Link href="/" className="text-2xl font-serif font-bold text-[#c9a84c] hover:text-[#b89a3e] transition">
            3D-друк
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed mt-2">
            Якісний 3D-друк на замовлення. Іграшки, прототипи, допомога ЗСУ.
          </p>
          <p className="text-gray-400 text-xs mt-4">© 2026 — Всі права захищені.</p>
        </div>

        {/* Навігація */}
        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Навігація</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-gray-300 hover:text-[#7ec8a3] transition">Головна</Link></li>
            <li><Link href="/services" className="text-gray-300 hover:text-[#7ec8a3] transition">Послуги</Link></li>
            <li><Link href="/printer" className="text-gray-300 hover:text-[#7ec8a3] transition">Принтери</Link></li>
            <li><Link href="/gallery" className="text-gray-300 hover:text-[#7ec8a3] transition">Каталог</Link></li>
            <li><Link href="/contacts" className="text-gray-300 hover:text-[#7ec8a3] transition">Контакти</Link></li>
          </ul>
        </div>

        {/* Корисне */}
        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Корисне</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/order" className="text-gray-300 hover:text-[#7ec8a3] transition">Замовити друк</Link></li>
            <li><Link href="/privacy" className="text-gray-300 hover:text-[#7ec8a3] transition">Політика конфіденційності</Link></li>
            <li><Link href="/terms" className="text-gray-300 hover:text-[#7ec8a3] transition">Умови використання</Link></li>
            <li><Link href="/#pricing" className="text-gray-300 hover:text-[#7ec8a3] transition">Доставка та оплата</Link></li>
          </ul>
        </div>

        {/* Контакти */}
        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Контакти</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-[#7ec8a3] transition">
                📞 {c.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${c.email}`} className="hover:text-[#7ec8a3] transition">
                ✉️ {c.email}
              </a>
            </li>
            <li>
              <a href={c.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-[#7ec8a3] transition">
                📱 Telegram: @3d_print
              </a>
            </li>
            <li>
              <a href={c.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#7ec8a3] transition">
                💬 WhatsApp
              </a>
            </li>
            <li>
              <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#7ec8a3] transition">
                📷 Instagram: @3d_print_ua
              </a>
            </li>
          </ul>
          <p className="text-gray-400 text-xs mt-4">{c.address}</p>
        </div>
      </div>
    </footer>
  );
}