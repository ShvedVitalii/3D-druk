'use client';

import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GalleryAddToCart from '@/components/ui/GalleryAddToCart';
import Pagination from '@/components/ui/Pagination';
import { useEffect, useState, use } from 'react';

const ITEMS_PER_PAGE = 9;

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Розгортаємо params за допомогою React.use()
  const { slug } = use(params);
  
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/catalog');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const catalog = data || { categories: [], products: [] };
        const cat = catalog.categories.find((c: any) => c.slug === slug);
        if (!cat) {
          setLoading(false);
          router.push('/404');
          return;
        }
        setCategory(cat);
        const filtered = catalog.products.filter(
          (p: any) => p.categoryId === cat.id && !p.hidden
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Помилка завантаження категорії:', err);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, router]);

  // Скидання сторінки при зміні slug
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  if (loading) return <div className="pt-32 pb-20 container-custom text-center">Завантаження...</div>;
  if (!category) return notFound();

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function getMainSpecs(product: any) {
    if (!product.specs || product.specs.length === 0) return null;
    const material = product.specs.find((s: any) =>
      s.label.toLowerCase().includes('матеріал') ||
      s.label.toLowerCase().includes('матеріали')
    );
    const dimensions = product.specs.find((s: any) =>
      s.label.toLowerCase().includes('розмір') ||
      s.label.toLowerCase().includes('габарит') ||
      s.label.toLowerCase().includes('ш') ||
      s.label.includes('х')
    );
    const weight = product.specs.find((s: any) =>
      s.label.toLowerCase().includes('вага')
    );
    return { material, dimensions, weight };
  }

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product: any) => {
              const mainImage = product.images?.[0] || '/images/placeholder.jpg';
              const finalPrice = product.discount
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price;
              const specs = getMainSpecs(product);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col"
                >
                  <Link href={`/product/${product.id}`} className="block relative h-56 bg-gray-100 overflow-hidden">
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                        -{product.discount}%
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                        Немає в наявності
                      </div>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-bold text-[#1a3c34] text-lg group-hover:text-[#c9a84c] transition line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">{product.description}</p>

                    {specs && (
                      <div className="mt-2 space-y-0.5 text-xs text-gray-600">
                        {specs.material && (
                          <p><span className="font-medium">Матеріал:</span> {specs.material.value}</p>
                        )}
                        {specs.dimensions && (
                          <p><span className="font-medium">Розміри:</span> {specs.dimensions.value}</p>
                        )}
                        {specs.weight && (
                          <p><span className="font-medium">Вага:</span> {specs.weight.value}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        {product.discount > 0 ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl font-bold text-[#1a3c34]">
                              {finalPrice} ₴
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
                      </div>
                    </div>

                    <div className="mt-3">
                      <GalleryAddToCart
                        item={{
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          discount: product.discount,
                          originalPrice: product.oldPrice,
                          category: category.name,
                          image: mainImage,
                          maxQuantity: product.maxQuantity,
                          inStock: product.inStock,
                        }}
                        buttonText="Додати в кошик"
                        className="w-full bg-[#1a3c34] hover:bg-[#2d5a4b] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                        showAnimation={true}
                        hideQuantityControls={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
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