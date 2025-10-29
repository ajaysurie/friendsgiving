export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-thanksgiving-peach rounded-full" />
        <div className="absolute inset-0 border-4 border-thanksgiving-orange border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-2xl animate-bounce">🦃</div>
      <p className="mt-4 text-thanksgiving-cranberry font-medium">
        Loading...
      </p>
    </div>
  );
}
