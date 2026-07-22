import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategoryData(slug: string) {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'catalog')
    .single();

  const catalog = data?.data || { categories: [], products: [] };
  const category = catalog.categories.find((c: any) => c.slug === slug);
  if (!category) return null;

  const products = catalog.products.filter(
    (p: any) => p.categoryId === category.id && !p.hidden
  );
  return { category, products };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // <--- ОСНОВНЕ ВИПРАВЛЕННЯ
  const data = await getCategoryData(slug);
  if (!data) return notFound();

  const { category, products } = data;

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/gallery" className="hover:text-[#c9a84c] transition">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1a3c34] font-medium">{category.name}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold text-[#1a3c34]">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-500 text-lg mt-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          Знайдено {products.length} товарів
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg">
            У цій категорії поки немає товарів
          </p>
          <Link
            href="/gallery"
            className="text-[#c9a84c] hover:underline mt-4 inline-block"
          >
            Повернутися до категорій
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => {
            const mainImage = product.images?.[0] || '/images/placeholder.jpg';
            const finalPrice = product.discount
              ? Math.round(product.price * (1 - product.discount / 100))
              : product.price;
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-56 bg-gray-100">
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Немає в наявності
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1a3c34] text-lg group-hover:text-[#c9a84c] transition line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
// У картці товару, де виводиться ціна:
<div className="mt-3 flex items-center justify-between">
  <div>
    {product.discount && product.discount > 0 ? (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xl font-bold text-[#1a3c34]">
          {Math.round(product.price * (1 - product.discount / 100))} ₴
        </span>
        <span className="text-sm text-red-500 line-through">
          {product.price} ₴
        </span>
        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
          -{product.discount}%
        </span>
      </div>
    ) : (
      <span className="text-2xl font-bold text-[#1a3c34]">{product.price} ₴</span>
    )}
    {product.oldPrice && product.oldPrice > product.price && !product.discount && (
      <span className="text-sm text-red-500 line-through ml-2">{product.oldPrice} ₴</span>
    )}
  </div>
  <span className="text-[#c9a84c] opacity-0 group-hover:opacity-100 transition">→</span>
</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/gallery"
          className="inline-block px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-medium hover:border-[#c9a84c] hover:text-[#c9a84c] transition"
        >
          ← Всі категорії
        </Link>
      </div>
    </div>
  );
}