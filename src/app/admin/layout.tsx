import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Отримуємо сесію на сервері
  const session = await getServerSession(authOptions);

  // Якщо сесії немає – перенаправляємо на сторінку входу (/admin)
  if (!session) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Бічна навігація */}
      <Sidebar />
      
      {/* Основний контент – з відступом для десктопу */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-h-screen md:ml-64">
        {children}
      </div>
    </div>
  );
}