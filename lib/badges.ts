import { Dish } from "@/types";

export interface Badge {
  emoji: string;
  label: string;
}

export function getBadgesForDish(dish: Dish, allDishes: Dish[]): Badge[] {
  const badges: Badge[] = [];

  if (!dish.claimedBy) return badges;

  // Get all dishes claimed by this person
  const personDishes = allDishes.filter(d => d.claimedBy === dish.claimedBy);

  // 🥇 First! - First person to claim any dish
  const allClaimedDishes = allDishes.filter(d => d.claimedBy);
  const sortedByClaimTime = [...allClaimedDishes].sort((a, b) => a.createdAt - b.createdAt);
  const firstClaimed = sortedByClaimTime[0];
  if (firstClaimed && firstClaimed.id === dish.id) {
    badges.push({ emoji: "🥇", label: "First!" });
  }

  // 🎯 Double Threat - Bringing 2+ dishes
  if (personDishes.length >= 2) {
    badges.push({ emoji: "🎯", label: "Double Threat" });
  }

  // 🦃 Main Event - Claimed turkey/main dish
  const dishNameLower = dish.dishName.toLowerCase();
  const mainDishKeywords = ["turkey", "ham", "roast", "brisket", "prime rib"];
  if (mainDishKeywords.some(keyword => dishNameLower.includes(keyword))) {
    badges.push({ emoji: "🦃", label: "Main Event" });
  }

  // 🍰 Sweet Tooth - Claimed dessert
  const dessertKeywords = ["pie", "cake", "cookie", "brownie", "dessert", "pudding", "tart", "cheesecake", "cobbler", "crisp"];
  if (dessertKeywords.some(keyword => dishNameLower.includes(keyword))) {
    badges.push({ emoji: "🍰", label: "Sweet Tooth" });
  }

  // ⭐ MVP - Highest reactions
  const totalReactions = Object.values(dish.reactions).reduce((sum, count) => sum + count, 0);
  const allReactionCounts = allDishes.map(d =>
    Object.values(d.reactions).reduce((sum, count) => sum + count, 0)
  );
  const maxReactions = Math.max(...allReactionCounts, 0);

  // Only show MVP if there are reactions and this dish has the most
  if (maxReactions > 0 && totalReactions === maxReactions && totalReactions >= 3) {
    badges.push({ emoji: "⭐", label: "MVP" });
  }

  return badges;
}
