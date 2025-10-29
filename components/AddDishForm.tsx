"use client";

import { useState } from "react";
import { DIETARY_TAGS } from "@/types";

interface AddDishFormProps {
  onSuccess: () => void;
}

export default function AddDishForm({ onSuccess }: AddDishFormProps) {
  const [dishName, setDishName] = useState("");
  const [personName, setPersonName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dishName.trim() || !personName.trim()) {
      setError("Please enter both dish name and your name");
      return;
    }

    setCreating(true);
    setError("");

    try {
      // Create the dish
      const dishResponse = await fetch("/api/admin/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: dishName.trim(),
          dietaryTags: selectedTags,
        }),
      });

      if (!dishResponse.ok) {
        const errorData = await dishResponse.json();
        throw new Error(errorData.error || "Failed to create dish");
      }

      const dish = await dishResponse.json();

      // Wait a bit longer to ensure the dish is saved in KV
      await new Promise(resolve => setTimeout(resolve, 300));

      // Try to claim the dish with retries (for in-memory KV timing issues)
      let claimSuccess = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        const claimResponse = await fetch(`/api/dishes/${dish.id}/claim`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personName: personName.trim() }),
        });

        if (claimResponse.ok) {
          claimSuccess = true;
          break;
        }

        // Wait before retrying
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      if (!claimSuccess) {
        // Dish was created but claiming failed - still show as success
        console.warn("Dish created but auto-claim failed. User can claim manually.");
      }

      // Reset form
      setDishName("");
      setPersonName("");
      setSelectedTags([]);

      // Wait a moment before calling success to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 200));
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white">
      <h3 className="font-heading text-2xl font-bold text-thanksgiving-red mb-6">
        Add Your Dish
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-thanksgiving-cranberry mb-2">
              Dish Name
            </label>
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-thanksgiving-peach bg-white focus:border-thanksgiving-orange focus:outline-none transition-colors"
              placeholder="Roasted Turkey, Pumpkin Pie..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-thanksgiving-cranberry mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-thanksgiving-peach bg-white focus:border-thanksgiving-orange focus:outline-none transition-colors"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-thanksgiving-cranberry mb-3">
            Dietary Tags (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? "bg-thanksgiving-orange text-white shadow-md scale-105"
                    : "bg-white text-thanksgiving-cranberry border-2 border-thanksgiving-peach hover:border-thanksgiving-orange/40"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={creating}
          className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">🦃</span>
              Creating your dish...
            </span>
          ) : (
            "Add & Claim Dish"
          )}
        </button>

        <p className="text-xs text-thanksgiving-cranberry/60 text-center">
          AI will generate a beautiful image for your dish
        </p>
      </form>
    </div>
  );
}
