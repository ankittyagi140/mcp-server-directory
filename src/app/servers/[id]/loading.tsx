export default function ServerDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8"></div>
      
      <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-gray-200 animate-pulse mx-auto sm:mx-0"></div>
            <div className="text-center sm:text-left">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 md:mb-6 rounded-lg border p-4 md:p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="mb-4 md:mb-6 rounded-lg border p-4 md:p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border p-4 md:p-6 md:sticky md:top-24">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="pt-3 md:pt-4">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 