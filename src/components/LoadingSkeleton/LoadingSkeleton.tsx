export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 border border-gray-100">
        <div className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-36 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
