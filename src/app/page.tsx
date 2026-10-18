import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Helper function to lazily initialize Supabase client
function getSupabaseServerClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
  return createClient(supabaseUrl, supabaseKey);
}

async function HeroSection() {
  const supabase = getSupabaseServerClient();
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
      {/* BADGE: Clean DM Sans for uppercase tracking */}
      <span
        className={`font-sans px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase mb-6 ${
          heroImageUrl
            ? "bg-amber-500 text-white"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {heroBadge}
      </span>

      {/* TITLE: Vollkorn (or Source Serif 4) for that elegant, artisan bakery feel */}
      <h1 className="font-vollkorn text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-sm leading-[1.1]">
        {heroTitle.includes("Love") ? (
          <>
            {heroTitle.replace("Love", "")}
            <span
              className={`italic ${
                heroImageUrl ? "text-amber-400" : "text-amber-600"
              }`}
            >
              Love
            </span>
          </>
        ) : (
          heroTitle
        )}
      </h1>

      {/* DESCRIPTION: Mulish for highly readable, friendly body text */}
      <p
        className={`font-mulish text-lg md:text-xl mb-8 max-w-2xl leading-relaxed ${
          heroImageUrl ? "text-neutral-100" : "text-neutral-600"
        }`}
      >
        {heroDescription}
      </p>
    </section>
  );
}

async function ProductList() {
  const supabase = getSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 pt-2">
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full py-12 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-100">
          {/* Empty state uses Mulish for clean readability */}
          <p className="font-mulish text-lg">No treats uploaded yet.</p>
        </div>
      )}
    </div>
  );
}

async function PromotionSection() {
  const supabase = getSupabaseServerClient();
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
              {/* PROMO BADGE: DM Sans */}
              {promo.badge && (
                <span className="font-sans inline-block px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold tracking-[0.1em] uppercase mb-4">
                  {promo.badge}
                </span>
              )}

              {/* PROMO TITLE: Vollkorn for premium, standout feel */}
              <h3 className="font-vollkorn text-2xl md:text-3xl font-bold mb-3 leading-tight">
                {promo.title}
              </h3>

              {/* PROMO SUBTITLE: Mulish for readability */}
              <p className="font-mulish text-amber-100 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                {promo.subtitle}
              </p>
            </div>

            {/* PROMO BUTTON: DM Sans for clear, trustworthy action */}
            <a
              href={promo.button_link || "#gallery"}
              className="font-sans inline-block self-start px-6 py-3 bg-white text-amber-900 font-semibold rounded-xl hover:bg-amber-50 transition shadow-md text-sm"
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
      <Suspense
        fallback={
          <div className="py-20 text-center text-neutral-400 font-mulish">
            Loading hero...
          </div>
        }
      >
        <HeroSection />
      </Suspense>

      <section id="gallery" className="py-8 px-6 md:px-12 max-w-7xl mx-auto">
        {/* SECTION HEADING: Source Serif 4 for elegant section breaks */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 mb-8 tracking-tight">
          Featured Menu
        </h2>
        <Suspense
          fallback={
            <div className="py-12 text-center text-neutral-400 font-mulish">
              Loading fresh menu...
            </div>
          }
        >
          <ProductList />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <PromotionSection />
      </Suspense>
    </div>
  );
}
