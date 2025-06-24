export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-4">
        <div className="loader mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}