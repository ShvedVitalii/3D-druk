import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GalleryAddToCart from '@/components/ui/GalleryAddToCart';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProduct(id: string) {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'catalog')
    .single();

  const catalog = data?.data || { products: [] };
  const product = catalog.products.find((p: any) => p.id === id);
  if (!product) return null;

  const category = catalog.categories.find((c: any) => c.id === product.categoryId);
  return { product, category };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // <--- ВИПРАВЛЕННЯ
  const data = await getProduct(id);
  if (!data) return notFound();

  const { product, category } = data;
  const mainImage = product.images?.[0] || '/images/placeholder.jpg';
  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div className="pt-32 pb-20 container-custom max-w-5xl mx-auto">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/gallery" className="hover:text-[#c9a84c] transition">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-[#c9a84c] transition"
            >
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-[#1a3c34] font-medium">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                -{product.discount}%
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-4 right-4 bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                Немає в наявності
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 hover:border-[#c9a84c] transition cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1a3c34]">
            {product.title}
          </h1>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {category.name}
            </Link>
          )}

// У блоці ціни:
<div className="mt-4 flex items-center gap-3">
  {product.discount && product.discount > 0 ? (
    <>
      <span className="text-3xl font-bold text-[#1a3c34]">
        {Math.round(product.price * (1 - product.discount / 100))} ₴
      </span>
      <span className="text-lg text-red-500 line-through">{product.price} ₴</span>
      <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
        -{product.discount}%
      </span>
    </>
  ) : (
    <>
      <span className="text-3xl font-bold text-[#1a3c34]">{product.price} ₴</span>
      {product.oldPrice && product.oldPrice > product.price && (
        <span className="text-lg text-red-500 line-through">{product.oldPrice} ₴</span>
      )}
    </>
  )}
</div>

          <div className="mt-4">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {product.specs?.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-[#1a3c34] mb-3">Характеристики</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((spec: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-gray-200 py-1.5 text-sm"
                  >
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="font-medium text-[#1a3c34]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4">
            <GalleryAddToCart
              item={{
                id: product.id,
                title: product.title,
                price: product.price,
                discount: product.discount,
                originalPrice: product.oldPrice,
                category: category?.name || 'Товар',
                image: mainImage,
              }}
            />
            <Link
              href="/gallery"
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-medium hover:border-[#c9a84c] hover:text-[#c9a84c] transition"
            >
              Продовжити покупки
            </Link>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span>
                100% гарантія якості. Безкоштовна заміна при браку.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}