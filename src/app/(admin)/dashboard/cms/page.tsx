"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminCmsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cms" | "orders">("cms");
  const [savingHero, setSavingHero] = useState(false);
  const [savingPromo, setSavingPromo] = useState(false);

  // Hero State
  const [heroId, setHeroId] = useState("");
  const [heroBadge, setHeroBadge] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // Promotions State
  const [promotions, setPromotions] = useState<any[]>([]);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoSubtitle, setPromoSubtitle] = useState("");
  const [promoBadge, setPromoBadge] = useState("Special Offer 🔥");
  const [promoButtonText, setPromoButtonText] = useState("Order Now");
  const [promoButtonLink, setPromoButtonLink] = useState("#gallery");
  const [promoFile, setPromoFile] = useState<File | null>(null);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchCmsData();
    fetchOrders();
  }, []);

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      // Fetch Hero Content
      const { data: heroData } = await supabase
        .from("hero_content")
        .select("*")
        .single();

      if (heroData) {
        setHeroId(heroData.id);
        setHeroBadge(heroData.badge || "");
        setHeroTitle(heroData.title || "");
        setHeroDescription(heroData.description || "");
        setHeroImageUrl(heroData.image_url || "");
      }

      // Fetch Promotions
      const { data: promoData } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (promoData) {
        setPromotions(promoData);
      }
    } catch (error) {
      console.error("Error fetching CMS data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);

    try {
      let imageUrl = heroImageUrl;

      if (heroFile) {
        const fileExt = heroFile.name.split(".").pop();
        const fileName = `hero_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, heroFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("hero_content")
        .update({
          badge: heroBadge,
          title: heroTitle,
          description: heroDescription,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", heroId);

      if (error) throw error;
      alert("Hero section updated successfully!");
      setHeroImageUrl(imageUrl);
      setHeroFile(null);
    } catch (error: any) {
      alert("Error updating hero: " + error.message);
    } finally {
      setSavingHero(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPromo(true);

    try {
      let imageUrl = "";

      if (promoFile) {
        const fileExt = promoFile.name.split(".").pop();
        const fileName = `promo_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, promoFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("promotions").insert([
        {
          title: promoTitle,
          subtitle: promoSubtitle,
          badge: promoBadge,
          button_text: promoButtonText,
          button_link: promoButtonLink,
          image_url: imageUrl,
          is_active: true,
        },
      ]);

      if (error) throw error;

      alert("Promotion banner created!");
      setPromoTitle("");
      setPromoSubtitle("");
      setPromoFile(null);
      fetchCmsData();
    } catch (error: any) {
      alert("Error creating promotion: " + error.message);
    } finally {
      setSavingPromo(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setPromotions(promotions.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-500 font-sans">
        Loading CMS manager...
      </div>
    );
  }

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8 font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Admin CMS & Orders
          </h1>
          <p className="text-neutral-500 mt-1 font-mulish">
            Customize your storefront and track customer WhatsApp orders in
            real-time.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-neutral-100 p-1 rounded-[0.04rem]">
          <button
            onClick={() => setActiveTab("cms")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[0.04rem] transition ${
              activeTab === "cms"
                ? "bg-white shadow-xs text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Store CMS
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-[0.04rem] transition ${
              activeTab === "orders"
                ? "bg-white shadow-xs text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            📦 WhatsApp Orders {pendingCount > 0 && `(${pendingCount})`}
          </button>
        </div>
      </div>

      {activeTab === "orders" ? (
        <section className="bg-white p-8 rounded-[0.04rem] shadow-sm border border-neutral-100 space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">
            Customer WhatsApp Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-neutral-400 py-12 text-center font-mulish">
              No orders recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 border border-neutral-200 rounded-[0.04rem] bg-neutral-50/50 flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-neutral-900">
                        {order.customer_name}
                      </span>
                      <span className="text-xs text-neutral-500">
                        📞 {order.customer_phone}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-[0.04rem] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 font-mulish">
                      <p className="font-semibold text-neutral-700 mb-1">
                        Items Ordered:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {order.items?.map((item: any, idx: number) => (
                          <li key={idx}>
                            {item.title} (x{item.quantity}) — $
                            {(item.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Placed on: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between gap-2">
                    <span className="text-lg font-extrabold text-neutral-900">
                      ${order.total_price.toFixed(2)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-white border border-neutral-300 rounded-[0.04rem] outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Baking">Baking 🧁</option>
                      <option value="Ready">Ready 🚀</option>
                      <option value="Completed">Completed ✅</option>
                      <option value="Cancelled">Cancelled ❌</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-12">
          {/* Hero Section Form */}
          <section className="bg-white p-8 rounded-[0.04rem] shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Hero Section Setting
            </h2>
            <form onSubmit={handleSaveHero} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full px-4 py-2 border rounded-[0.04rem] focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  placeholder="e.g. Freshly Baked Daily 🧁"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-1">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-[0.04rem] focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  placeholder="Homemade Sweets Crafted With Love"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-1">
                  Description Paragraph here
                </label>
                <textarea
                  rows={3}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-[0.04rem] focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mulish"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-1">
                  Hero Image (Optional background)
                </label>
                {heroImageUrl && (
                  <div className="mb-2 h-32 w-full max-w-xs overflow-hidden rounded-[0.04rem] border">
                    <img
                      src={heroImageUrl}
                      alt="Hero Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-[0.04rem] file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
              </div>

              <button
                type="submit"
                disabled={savingHero}
                className="py-2.5 px-6 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-widest rounded-[0.04rem] transition shadow-sm disabled:opacity-50"
              >
                {savingHero ? "Saving Hero..." : "Save Hero Section"}
              </button>
            </form>
          </section>

          {/* Promotions Section Manager */}
          <section className="bg-white p-8 rounded-[0.04rem] shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Promotional Banners Manager
            </h2>

            {/* Create Promotion Form */}
            <form
              onSubmit={handleCreatePromo}
              className="space-y-4 bg-neutral-50 p-6 rounded-[0.04rem] border border-neutral-200 mb-8"
            >
              <h3 className="font-semibold text-neutral-800">
                Create New Promotion Banner
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    placeholder="e.g. Weekend Special Box!"
                    className="w-full px-3 py-2 border rounded-[0.04rem] bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-600 mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={promoBadge}
                    onChange={(e) => setPromoBadge(e.target.value)}
                    placeholder="Special Offer 🔥"
                    className="w-full px-3 py-2 border rounded-[0.04rem] bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-600 mb-1">
                  Subtitle / Details
                </label>
                <input
                  type="text"
                  value={promoSubtitle}
                  onChange={(e) => setPromoSubtitle(e.target.value)}
                  placeholder="Get 20% off all mixed macaron orders this weekend."
                  className="w-full px-3 py-2 border rounded-[0.04rem] bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500 font-mulish"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-600 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={promoButtonText}
                    onChange={(e) => setPromoButtonText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-[0.04rem] bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-600 mb-1">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPromoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-neutral-500 file:py-1.5 file:px-3 file:rounded-[0.04rem] file:border-0 file:bg-brand-100 file:text-brand-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPromo}
                className="py-2 px-5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-[0.04rem] transition disabled:opacity-50"
              >
                {savingPromo ? "Creating..." : "Add Promotion Banner"}
              </button>
            </form>

            {/* Existing Promotions List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-800">
                Active Promotions
              </h3>
              {promotions.length === 0 ? (
                <p className="text-sm text-neutral-400 font-mulish">
                  No promotion banners created yet.
                </p>
              ) : (
                promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between p-4 border rounded-[0.04rem] bg-white shadow-xs"
                  >
                    <div>
                      <span className="text-xs bg-brand-100 text-brand-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded-[0.04rem] mr-2">
                        {promo.badge}
                      </span>
                      <h4 className="font-bold text-neutral-900 inline">
                        {promo.title}
                      </h4>
                      <p className="text-sm text-neutral-500 mt-0.5 font-mulish">
                        {promo.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 px-3 py-1.5 rounded-[0.04rem] bg-red-50 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
