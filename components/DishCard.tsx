"use client";

import { Dish } from "@/types";
import Image from "next/image";
import { useState } from "react";
import ClaimDishModal from "./ClaimDishModal";
import { getPersonColor } from "@/lib/colors";
import { getBadgesForDish } from "@/lib/badges";

interface DishCardProps {
  dish: Dish;
  allDishes: Dish[];
  onUpdate: () => void;
}

const QUICK_EMOJIS = ["❤️", "🔥", "😋", "🦃", "🎃"];

export default function DishCard({ dish, allDishes, onUpdate }: DishCardProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [addingReaction, setAddingReaction] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAddReaction = async (emoji: string) => {
    setAddingReaction(true);
    try {
      await fetch(`/api/dishes/${dish.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to add reaction:", error);
    } finally {
      setAddingReaction(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${dish.dishName}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/dishes/${dish.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dish");
      }

      onUpdate();
    } catch (error) {
      console.error("Failed to delete dish:", error);
      alert("Failed to delete dish. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const isClaimed = !!dish.claimedBy;
  const badges = getBadgesForDish(dish, allDishes);

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-3xl transition-all duration-300 flex flex-col ${
          isClaimed
            ? "bg-white/60 backdrop-blur-sm shadow-lg"
            : "bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:scale-[1.02]"
        } border border-white`}
      >
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg disabled:opacity-50"
          title="Delete dish"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={dish.generatedImageUrl}
            alt={dish.dishName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isClaimed && (
            <div className="absolute inset-0 bg-thanksgiving-cranberry/10" />
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Dish Name */}
          <h3 className="font-heading text-xl font-bold text-thanksgiving-red mb-2">
            {dish.dishName}
          </h3>

          {/* Dietary Tags */}
          <div className="min-h-[28px] mb-3">
            {dish.dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dish.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-thanksgiving-peach text-thanksgiving-orange font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Claimed Status or Claim Button */}
          <div className="mb-4">
            {isClaimed ? (
              <div className="bg-thanksgiving-cream/60 rounded-2xl p-4 border-2 border-thanksgiving-yellow/40">
                <div className="text-xs text-thanksgiving-cranberry/70 font-medium mb-1 flex items-center gap-1">
                  <span className="text-[10px]">🏆</span>
                  Claimed by
                </div>
                <div
                  className="text-lg font-bold mb-2"
                  style={{ color: getPersonColor(dish.claimedBy!) }}
                >
                  {dish.claimedBy}
                </div>

                {/* Badges */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 border border-thanksgiving-yellow/30"
                        title={badge.label}
                      >
                        <span className="text-xs">{badge.emoji}</span>
                        <span className="text-[10px] font-medium text-thanksgiving-cranberry">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowClaimModal(true)}
                className="w-full bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Claim this! 🎉
              </button>
            )}
          </div>

          {/* Reactions */}
          <div className="border-t border-thanksgiving-peach pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-thanksgiving-red/70 font-medium">
                Reactions
              </span>
            </div>

            {/* Show existing reactions */}
            {Object.keys(dish.reactions).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {Object.entries(dish.reactions).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    className="text-sm bg-thanksgiving-cream px-2 py-1 rounded-lg"
                  >
                    {emoji} {count}
                  </span>
                ))}
              </div>
            )}

            {/* Quick emoji reactions */}
            <div className="flex gap-2">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAddReaction(emoji)}
                  disabled={addingReaction}
                  className="text-xl hover:scale-125 transition-transform duration-200 disabled:opacity-50"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showClaimModal && (
        <ClaimDishModal
          dish={dish}
          onClose={() => setShowClaimModal(false)}
          onClaimed={onUpdate}
        />
      )}
    </>
  );
}
