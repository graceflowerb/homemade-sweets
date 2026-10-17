import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

async function HeroSection() {
  const supabase = createClient();
  const { data: hero } = await supabase
    .from("hero_content")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const heroBadge = hero?.badge || "Freshly Baked Daily 🧁";
  const heroTitle = hero?.title || "Homemade Sweets Crafted With Love";
  const heroDescription =
    hero?.description ||
    "Discover artisan cookies, rich brownies, and custom treats made from scratch. Order instantly via WhatsApp!";
  const heroImageUrl = hero?.image_url;

  return (
    <section
      className={`relative py-24 px-6 md:px-12 text-center max-w-5xl mx-auto flex flex-col items-center justify-center rounded-3xl my-8 overflow-hidden shadow-sm ${
        heroImageUrl ? "text-white" : "text-neutral-900 bg-amber-50/40"
      }`}
      style={
        heroImageUrl
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${heroImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      <span
        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 ${
          heroImageUrl
            ? "bg-amber-500 text-white"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {heroBadge}
      </span>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
        {heroTitle.includes("Love") ? (
          <>
            {heroTitle.replace("Love", "")}
            <span
              className={heroImageUrl ? "text-amber-400" : "text-amber-600"}
            >
              Love
            </span>
          </>
        ) : (
          heroTitle
        )}
      </h1>
      <p
        className={`text-lg md:text-xl mb-8 max-w-2xl ${heroImageUrl ? "text-neutral-100" : "text-neutral-600"}`}
      >
        {heroDescription}
      </p>
    </section>
  );
}

async function ProductList() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar snap-x scroll-smooth">
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="w-full py-12 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-100">
          No treats uploaded yet.
        </div>
      )}
    </div>
  );
}

async function PromotionSection() {
  const supabase = createClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="relative overflow-hidden rounded-3xl bg-amber-900 text-white p-8 md:p-10 flex flex-col justify-between shadow-lg"
            style={
              promo.image_url
                ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${promo.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            <div>
              {promo.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider mb-4">
                  {promo.badge}
                </span>
              )}
              <h3 className="text-2xl md:text-3xl font-extrabold mb-2">
                {promo.title}
              </h3>
              <p className="text-amber-100 text-sm md:text-base max-w-md mb-6">
                {promo.subtitle}
              </p>
            </div>
            <a
              href={promo.button_link || "#gallery"}
              className="inline-block self-start px-6 py-3 bg-white text-amber-900 font-semibold rounded-xl hover:bg-amber-50 transition shadow-md text-sm"
            >
              {promo.button_text || "Order Now"}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-neutral-400">
            Loading hero...
          </div>
        }
      >
        <HeroSection />
      </Suspense>

      {/* Gallery Section */}
      <section id="gallery" className="py-8 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
          Featured Menu
        </h2>
        <Suspense
          fallback={
            <div className="py-12 text-center text-neutral-400">
              Loading fresh menu...
            </div>
          }
        >
          <ProductList />
        </Suspense>
      </section>

      {/* Promotions Section */}
      <Suspense fallback={null}>
        <PromotionSection />
      </Suspense>
    </div>
  );
}
