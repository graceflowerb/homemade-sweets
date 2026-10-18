import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

// Revalidate cache every 60 seconds or make dynamic
export const revalidate = 0;

export default async function Home() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-brand-50/30 text-neutral-800">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
        <span className="px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold tracking-wide uppercase mb-4">
          Freshly Baked Daily 🧁
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6">
          Homemade Sweets Crafted With{" "}
          <span className="text-brand-600">Love</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl">
          Discover artisan cookies, rich brownies, and custom treats made from
          scratch. Order instantly via WhatsApp and pick up or get local
          delivery!
        </p>
        <div className="flex gap-4">
          <a
            href="#gallery"
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-600/20 transition"
          >
            Explore Menu
          </a>
        </div>
      </section>

      {/* Horizontal Image Gallery Section */}
      <section id="gallery" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Featured Menu
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Scroll sideways to see our fresh batches
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar snap-x scroll-smooth">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden snap-start flex flex-col justify-between group hover:shadow-md transition"
              >
                <div className="relative h-64 w-full bg-neutral-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                    <span className="text-lg font-bold text-brand-700">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs bg-brand-50 text-brand-700 font-medium px-2.5 py-1 rounded-md">
                      Fresh Batch
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-12 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-100">
              No treats uploaded yet. Head over to the admin panel to add your
              first creation!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
