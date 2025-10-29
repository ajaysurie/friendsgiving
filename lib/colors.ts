// Generate a consistent color for a person's name
export function getPersonColor(name: string): string {
  // More varied, highly contrasting colors for better distinction
  const colors = [
    '#DC2626', // red-600 - bright red
    '#EA580C', // orange-600 - bright orange
    '#CA8A04', // yellow-700 - golden yellow
    '#16A34A', // green-600 - vibrant green
    '#0891B2', // cyan-600 - teal
    '#2563EB', // blue-600 - bright blue
    '#7C3AED', // violet-600 - purple
    '#C026D3', // fuchsia-600 - magenta
    '#DB2777', // pink-600 - hot pink
    '#059669', // emerald-600 - emerald green
    '#D97706', // amber-600 - amber
    '#9D2235', // thanksgiving-cranberry - deep red
  ];

  // Simple hash function to convert name to a number
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use modulo to select a color from the array
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
