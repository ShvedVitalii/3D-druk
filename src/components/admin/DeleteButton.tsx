'use client';

import { useTransition } from 'react';

interface DeleteButtonProps {
  deleteAction: () => Promise<void>;
  name: string;
}

export default function DeleteButton({ deleteAction, name }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Ви впевнені, що хочете видалити блок "${name}"?`)) {
      startTransition(async () => {
        await deleteAction();
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
    >
      {isPending ? 'Видалення...' : 'Видалити'}
    </button>
  );
}