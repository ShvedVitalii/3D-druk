'use client';

export default function ContactButton() {
  return (
    <button
      onClick={() => (window.location.href = '/contacts')}
      className="px-6 py-2.5 rounded-full border-2 border-[#c9a84c] text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c] hover:text-white transition-all duration-300"
    >
      Зв'язатися з нами
    </button>
  );
}