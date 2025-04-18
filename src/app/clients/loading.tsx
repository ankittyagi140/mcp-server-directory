export default function ClientsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Generate 6 loading card skeletons */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="px-6 py-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 px-6 py-2">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="mt-auto flex justify-between items-center p-4 pt-2 border-t">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse"></div>
                  <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 