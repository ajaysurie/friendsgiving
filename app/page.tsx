"use client";

import { useEffect, useState } from "react";
import { Dish, GalleryPhoto } from "@/types";
import DishCard from "@/components/DishCard";
import AddDishForm from "@/components/AddDishForm";
import GalleryUpload from "@/components/GalleryUpload";
import GalleryPhotoCard from "@/components/GalleryPhotoCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDish, setShowAddDish] = useState(false);

  const fetchDishes = async () => {
    try {
      const response = await fetch("/api/dishes");
      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/gallery");
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
  };

  useEffect(() => {
    fetchDishes();
    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF5E8] to-[#FFE8D6]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-thanksgiving-orange/20 to-thanksgiving-pumpkin/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-thanksgiving-red/15 to-thanksgiving-cranberry/15 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-[450px] h-[450px] bg-gradient-to-br from-thanksgiving-yellow/15 to-thanksgiving-orange/15 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #E87722 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="pt-16 pb-10 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-black mb-3 tracking-tight">
              <span className="inline-block bg-gradient-to-r from-thanksgiving-orange via-thanksgiving-pumpkin to-thanksgiving-red bg-clip-text text-transparent">
                Friends Giving
              </span>
            </h1>
            <div className="inline-block px-6 py-2 rounded-full bg-white/60 backdrop-blur-sm border-2 border-thanksgiving-orange/20 shadow-lg mb-6">
              <p className="text-2xl md:text-3xl font-heading font-bold text-thanksgiving-orange">
                2025
              </p>
            </div>
            <p className="text-lg md:text-xl text-thanksgiving-cranberry/70 font-medium">
              Share the feast, share the love
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-16">
          {/* Dishes Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-3xl font-bold text-thanksgiving-red mb-2">
                  The Feast
                </h2>
                <p className="text-thanksgiving-cranberry/70">
                  Claim a dish or add your own creation
                </p>
              </div>
              <button
                onClick={() => setShowAddDish(!showAddDish)}
                className="px-6 py-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-thanksgiving-orange border-2 border-thanksgiving-orange/20 hover:border-thanksgiving-orange/40"
              >
                {showAddDish ? "Cancel" : "+ Add a Dish"}
              </button>
            </div>

            {/* Add Dish Form */}
            {showAddDish && (
              <div className="mb-8 animate-in slide-up">
                <AddDishForm
                  onSuccess={() => {
                    setShowAddDish(false);
                    fetchDishes();
                  }}
                />
              </div>
            )}

            {/* Dishes Grid */}
            {loading ? (
              <LoadingSpinner />
            ) : dishes.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg">
                <div className="text-6xl mb-4">🍂</div>
                <h3 className="font-heading text-2xl font-bold text-thanksgiving-red mb-2">
                  No dishes yet!
                </h3>
                <p className="text-thanksgiving-cranberry/70 mb-6">
                  Be the first to add a delicious dish to the feast
                </p>
                <button
                  onClick={() => setShowAddDish(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-lg transition-all"
                >
                  Add First Dish
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Unclaimed Dishes Section */}
                {dishes.filter(d => !d.claimedBy).length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">📝</span>
                      <h3 className="font-heading text-2xl font-bold text-thanksgiving-orange">
                        Still Available
                      </h3>
                      <div className="flex-1 h-[2px] bg-gradient-to-r from-thanksgiving-orange/30 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dishes
                        .filter(dish => !dish.claimedBy)
                        .map((dish) => (
                          <DishCard
                            key={dish.id}
                            dish={dish}
                            allDishes={dishes}
                            onUpdate={fetchDishes}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Claimed Dishes Section */}
                {dishes.filter(d => d.claimedBy).length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">🎯</span>
                      <h3 className="font-heading text-2xl font-bold text-thanksgiving-cranberry">
                        Claimed
                      </h3>
                      <div className="flex-1 h-[2px] bg-gradient-to-r from-thanksgiving-cranberry/30 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dishes
                        .filter(dish => dish.claimedBy)
                        .map((dish) => (
                          <DishCard
                            key={dish.id}
                            dish={dish}
                            allDishes={dishes}
                            onUpdate={fetchDishes}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Gallery Section */}
          <section>
            <div className="mb-8">
              <h2 className="font-heading text-3xl font-bold text-thanksgiving-red mb-2">
                Memory Lane
              </h2>
              <p className="text-thanksgiving-cranberry/70">
                Share your favorite moments and give them a festive twist
              </p>
            </div>

            <div className="space-y-8">
              {/* Upload Section */}
              <div className="max-w-2xl mx-auto">
                <GalleryUpload onUploadComplete={fetchPhotos} />
              </div>

              {/* Photos Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo) => (
                    <GalleryPhotoCard
                      key={photo.id}
                      photo={photo}
                      onUpdate={fetchPhotos}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-thanksgiving-cranberry/60 text-sm">
            Made with ❤️ for FriendsGiving 2024
          </p>
        </footer>
      </div>
    </div>
  );
}
