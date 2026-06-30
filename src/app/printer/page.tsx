import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function PrinterPage() {
  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <h1 className="text-center mb-6 text-[#1a3c34] font-serif text-4xl font-bold">Наш 3D-принтер</h1>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl shadow-[#1a3c34]/20 border border-[#c9a84c]/20">
          <Image
            src="/images/printer.jpg"
            alt="3D принтер"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold text-[#1a3c34]">Ender-3 V3 SE</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c9a84c] rounded-full"></span> Технологія: FDM (пластик)</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c9a84c] rounded-full"></span> Робоча область: 220 x 220 x 250 мм</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c9a84c] rounded-full"></span> Мінімальна висота шару: 0.1 мм</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c9a84c] rounded-full"></span> Матеріали: PLA, ABS, PETG, TPU</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-[#c9a84c] rounded-full"></span> Швидкість друку: до 180 мм/с</li>
          </ul>
          <Button href="/order" variant="primary" className="shadow-lg shadow-[#1a3c34]/20">Замовити друк</Button>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="text-3xl font-serif font-bold text-[#1a3c34]">220<small className="text-sm font-normal text-gray-400">мм</small></div>
          <p className="text-gray-500 text-sm">Ширина столу</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="text-3xl font-serif font-bold text-[#1a3c34]">0.1<small className="text-sm font-normal text-gray-400">мм</small></div>
          <p className="text-gray-500 text-sm">Точність шару</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="text-3xl font-serif font-bold text-[#1a3c34]">180<small className="text-sm font-normal text-gray-400">мм/с</small></div>
          <p className="text-gray-500 text-sm">Швидкість друку</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="text-3xl font-serif font-bold text-[#1a3c34]">4<small className="text-sm font-normal text-gray-400">кг</small></div>
          <p className="text-gray-500 text-sm">Вага принтера</p>
        </div>
      </div>

      <div className="mt-16 bg-[#f5f0eb] p-8 rounded-3xl border border-[#d0c8c0]">
        <h2 className="text-2xl font-serif font-bold text-[#1a3c34] mb-6">Що ми друкуємо?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center border border-[#d0c8c0]/50">
            <span className="text-5xl mb-3">🧸</span>
            <h3 className="font-bold text-gray-800">Іграшки</h3>
            <p className="text-gray-500 text-sm">Фігурки, конструктори, пазли</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center border border-[#d0c8c0]/50">
            <span className="text-5xl mb-3">⚙️</span>
            <h3 className="font-bold text-gray-800">Прототипи</h3>
            <p className="text-gray-500 text-sm">Деталі, макети, шестерні</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center border border-[#d0c8c0]/50">
            <span className="text-5xl mb-3">🇺🇦</span>
            <h3 className="font-bold text-gray-800">Для ЗСУ</h3>
            <p className="text-gray-500 text-sm">Допоміжні засоби, адаптери</p>
          </div>
        </div>
      </div>
    </div>
  );
}