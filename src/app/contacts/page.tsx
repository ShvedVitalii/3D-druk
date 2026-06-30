export default function ContactsPage() {
  return (
    <div className="pt-32 pb-20 container-custom max-w-4xl mx-auto">
      <h1 className="text-center mb-6 text-[#1a3c34] font-serif text-4xl font-bold">Контакти</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#d0c8c0]/50 space-y-6">
          <p className="text-gray-500">Зв’яжіться з нами зручним способом:</p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3 text-lg"><span className="text-[#c9a84c] text-2xl">📞</span> <a href="tel:+380671234567" className="hover:text-[#c9a84c] transition">+380 (67) 123-45-67</a></li>
            <li className="flex items-center gap-3 text-lg"><span className="text-[#c9a84c] text-2xl">✉️</span> <a href="mailto:hello@3dprint.com" className="hover:text-[#c9a84c] transition">hello@3dprint.com</a></li>
            <li className="flex items-center gap-3 text-lg"><span className="text-[#c9a84c] text-2xl">📱</span> Telegram: <a href="#" className="hover:text-[#c9a84c] transition">@3d_print</a></li>
            <li className="flex items-center gap-3 text-lg"><span className="text-[#c9a84c] text-2xl">📷</span> Instagram: <a href="#" className="hover:text-[#c9a84c] transition">@3d_print_ua</a></li>
          </ul>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-400">Графік роботи: Пн–Пт 9:00–18:00</p>
            <p className="text-gray-400">Адреса: м. Львів, вул. Прикладна, 3</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a3c34] to-[#2d5a4b] p-8 rounded-3xl text-white flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
          <span className="text-7xl">🖨️</span>
          <h3 className="text-2xl font-serif font-bold">Працюємо для вас</h3>
          <p className="opacity-90">Відповімо на всі питання та допоможемо з вибором матеріалу та дизайну.</p>
          <button className="bg-[#c9a84c] text-[#1a3c34] px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-2xl transition hover:scale-105">
            Написати в Telegram
          </button>
        </div>
      </div>
    </div>
  );
}