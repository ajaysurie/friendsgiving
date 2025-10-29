"use client";

import { Dish } from "@/types";
import { useState } from "react";

interface ClaimDishModalProps {
  dish: Dish;
  onClose: () => void;
  onClaimed: () => void;
}

export default function ClaimDishModal({
  dish,
  onClose,
  onClaimed,
}: ClaimDishModalProps) {
  const [personName, setPersonName] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      setError("Please enter your name");
      return;
    }

    setClaiming(true);
    setError("");

    try {
      const response = await fetch(`/api/dishes/${dish.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personName: personName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to claim dish");
      }

      onClaimed();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200 border border-thanksgiving-peach">
        <h2 className="font-heading text-2xl font-bold text-thanksgiving-red mb-4">
          Claim {dish.dishName}! 🎉
        </h2>

        <form onSubmit={handleClaim}>
          <div className="mb-6">
            <label
              htmlFor="personName"
              className="block text-sm font-medium text-thanksgiving-cranberry mb-2"
            >
              What's your name?
            </label>
            <input
              type="text"
              id="personName"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-thanksgiving-peach bg-white focus:border-thanksgiving-orange focus:outline-none transition-colors"
              placeholder="Enter your name"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-thanksgiving-peach text-thanksgiving-cranberry font-semibold hover:bg-thanksgiving-peach transition-colors"
              disabled={claiming}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={claiming}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {claiming ? "Claiming..." : "Claim it!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
