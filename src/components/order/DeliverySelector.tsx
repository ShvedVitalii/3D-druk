'use client';

interface DeliverySelectorProps {
  value: { city: string; warehouse: string; deliveryType: 'nova' | 'ukr' | 'pickup' };
  onChange: (value: { city: string; warehouse: string; deliveryType: 'nova' | 'ukr' | 'pickup' }) => void;
}

export default function DeliverySelector({ value, onChange }: DeliverySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {/* Нова Пошта */}
        <button
          type="button"
          onClick={() => onChange({ ...value, deliveryType: 'nova' })}
          className={`p-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
            value.deliveryType === 'nova'
              ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-full max-w-[80px] h-16 md:h-20 overflow-hidden rounded-lg flex items-center justify-center bg-white">
            <img
              src="https://shop.novaposhta.ua/img/og_logo_shop.png"
              alt="Нова Пошта"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Nova_Poshta_logo.svg/2560px-Nova_Poshta_logo.svg.png';
              }}
            />
          </div>
          <span className="text-xs font-medium">Нова Пошта</span>
        </button>

        {/* Укрпошта */}
        <button
          type="button"
          onClick={() => onChange({ ...value, deliveryType: 'ukr' })}
          className={`p-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
            value.deliveryType === 'ukr'
              ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-full max-w-[80px] h-16 md:h-20 overflow-hidden rounded-lg flex items-center justify-center bg-white">
            <img
              src="https://inbase.com.ua/wp-content/uploads/2024/02/ukrposhta-1.png"
              alt="Укрпошта"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Ukrposhta_logo.svg/2560px-Ukrposhta_logo.svg.png';
              }}
            />
          </div>
          <span className="text-xs font-medium">Укрпошта</span>
        </button>

        {/* Самовивіз */}
        <button
          type="button"
          onClick={() => onChange({ ...value, deliveryType: 'pickup' })}
          className={`p-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
            value.deliveryType === 'pickup'
              ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-full max-w-[80px] h-16 md:h-20 overflow-hidden rounded-lg flex items-center justify-center bg-gray-50">
            <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 24 24" fill="none" stroke="#1a3c34" strokeWidth="1.5">
              <path d="M3 12L12 3L21 12" stroke="#1a3c34" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10V21H19V10" stroke="#1a3c34" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="9" y="15" width="6" height="6" stroke="#1a3c34" />
            </svg>
          </div>
          <span className="text-xs font-medium">Самовивіз</span>
        </button>
      </div>

      {value.deliveryType !== 'pickup' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Місто *</label>
            <input
              type="text"
              placeholder="Наприклад: Львів"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Відділення *</label>
            <input
              type="text"
              placeholder="Наприклад: №1 (вул. Стрийська, 30)"
              value={value.warehouse}
              onChange={(e) => onChange({ ...value, warehouse: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>
        </div>
      )}

      {value.deliveryType === 'pickup' && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">📍 Самовивіз: м. Стрий, вул. Народна, 8</p>
          <p className="text-gray-400 text-xs mt-1">Графік роботи: Пн–Пт 9:00–18:00</p>
        </div>
      )}
    </div>
  );
}