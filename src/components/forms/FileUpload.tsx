'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string; // наприклад: '.stl,.obj,.3mf'
  maxSize?: number; // в байтах
  allowedExtensions?: string[]; // масив розширень без крапки
  label?: string;
  required?: boolean;
}

export default function FileUpload({
  onFileSelect,
  accept = '*/*',
  maxSize = 50 * 1024 * 1024, // 50MB за замовчуванням
  allowedExtensions = [],
  label = 'Перетягніть файл або клікніть для вибору',
  required = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Перевірка розміру
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      setError(`Файл занадто великий. Максимальний розмір: ${maxMB} МБ`);
      return false;
    }

    // Перевірка розширення
    if (allowedExtensions.length > 0) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExtensions.includes(ext)) {
        setError(`Дозволені формати: ${allowedExtensions.join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) {
      onFileSelect(null);
      setFileName(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    onFileSelect(file);
    setFileName(file.name);

    // Для зображень – показуємо прев'ю
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext && imageExtensions.includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setFileName(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
          dragActive ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-gray-300 bg-gray-50 hover:border-[#c9a84c]'
        } ${error ? 'border-red-500 bg-red-50' : ''}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="hidden"
          required={required}
        />

        {!fileName ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-5xl">📁</span>
            <p className="text-gray-600 font-medium">{label}</p>
            {allowedExtensions.length > 0 && (
              <p className="text-gray-400 text-sm">Дозволені формати: {allowedExtensions.join(', ')}</p>
            )}
            <p className="text-gray-400 text-xs">
              Максимальний розмір: {Math.round(maxSize / (1024 * 1024))} МБ
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {preview ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#1a3c34]/10 flex items-center justify-center text-3xl flex-shrink-0">
                📄
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
              <p className="text-xs text-gray-400">Натисніть для заміни</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-red-500 hover:text-red-700 transition p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}