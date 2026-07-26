import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GalleryAddToCart from '@/components/ui/GalleryAddToCart';
import ProductGallery from './ProductGallery';

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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProduct(id);
  if (!data) return notFound();

  const { product, category } = data;
  const mainImage = product.images?.[0] || '/images/placeholder.jpg';

  return (
    <div className="pt-32 pb-20 container-custom max-w-5xl mx-auto">
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/gallery" className="hover:text-[#c9a84c] transition">Каталог</Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-[#c9a84c] transition">
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-[#1a3c34] font-medium">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery images={product.images || []} mainImage={mainImage} />

        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1a3c34]">
            {product.title}
          </h1>
          {category && (
            <Link href={`/category/${category.slug}`} className="text-sm text-blue-600 hover:underline">
              {category.name}
            </Link>
          )}

          <div className="mt-4 flex items-center gap-3">
            {product.discount > 0 ? (
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
                  <div key={i} className="flex justify-between border-b border-gray-200 py-1.5 text-sm">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="font-medium text-[#1a3c34]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <GalleryAddToCart
              item={{
                id: product.id,
                title: product.title,
                price: product.price,
                discount: product.discount,
                originalPrice: product.oldPrice,
                category: category?.name || 'Товар',
                image: mainImage,
                maxQuantity: product.maxQuantity,
                inStock: product.inStock,
              }}
              buttonText="Додати в кошик"
              className="w-full sm:w-auto px-6 py-3 bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-base rounded-xl"
              showAnimation={true}
              hideQuantityControls={false}
            />
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span>100% гарантія якості. Безкоштовна заміна при браку.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}