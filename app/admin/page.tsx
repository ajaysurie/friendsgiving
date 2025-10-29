"use client";

import { useEffect, useState } from "react";
import { Dish, DIETARY_TAGS } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

export default function AdminPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [dishName, setDishName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dishName.trim()) {
      setError("Please enter a dish name");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/admin/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: dishName.trim(),
          dietaryTags: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create dish");
      }

      // Reset form
      setDishName("");
      setSelectedTags([]);
      fetchDishes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) {
      return;
    }

    setDeleting(dishId);

    try {
      const response = await fetch(`/api/admin/dishes/${dishId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dish");
      }

      fetchDishes();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-thanksgiving-cranberry to-thanksgiving-red text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-2">
            🔧 Admin Dashboard
          </h1>
          <p className="text-center text-lg text-thanksgiving-cream">
            Manage dishes for your Friendsgiving
          </p>
        </div>
      </header>

      {/* Back to Home Link */}
      <div className="bg-thanksgiving-cream border-b-2 border-thanksgiving-peach py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-thanksgiving-cranberry hover:text-thanksgiving-orange transition-colors font-medium"
          >
            ← Back to FriendsGiving
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Dish Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-heading text-2xl font-bold text-thanksgiving-red mb-6">
              Add New Dish
            </h2>

            <form onSubmit={handleCreateDish} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-thanksgiving-cranberry mb-2">
                  Dish Name
                </label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-thanksgiving-peach focus:border-thanksgiving-orange focus:outline-none transition-colors"
                  placeholder="e.g., Roasted Turkey, Pumpkin Pie"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-thanksgiving-cranberry mb-3">
                  Dietary Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-thanksgiving-orange text-white"
                          : "bg-thanksgiving-peach text-thanksgiving-cranberry hover:bg-thanksgiving-orange/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={creating}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🦃</span>
                    Generating image...
                  </span>
                ) : (
                  "Add Dish"
                )}
              </button>

              <p className="text-xs text-thanksgiving-cranberry/70 text-center">
                AI will automatically generate a beautiful image for this dish!
              </p>
            </form>
          </div>

          {/* Dish List */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-heading text-2xl font-bold text-thanksgiving-red mb-6">
              All Dishes
            </h2>

            {loading ? (
              <LoadingSpinner />
            ) : dishes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-thanksgiving-cranberry">
                  No dishes yet. Add one above!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="border-2 border-thanksgiving-peach rounded-xl p-4 hover:border-thanksgiving-orange transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-thanksgiving-red">
                          {dish.dishName}
                        </h3>
                        {dish.claimedBy && (
                          <p className="text-sm text-thanksgiving-cranberry">
                            Claimed by: {dish.claimedBy}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        disabled={deleting === dish.id}
                        className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        {deleting === dish.id ? "..." : "Delete"}
                      </button>
                    </div>

                    {dish.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dish.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-thanksgiving-peach text-thanksgiving-orange"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-thanksgiving-beige border-t-2 border-thanksgiving-peach py-6 text-center">
        <p className="text-thanksgiving-cranberry">
          Made with ❤️ for Friendsgiving 2024
        </p>
      </footer>
    </div>
  );
}
