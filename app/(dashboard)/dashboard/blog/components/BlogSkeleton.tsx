const BlogSkeleton = () => (
    <main className="max-w-4xl mx-auto py-20 px-4 animate-pulse">
        {/* Title Skeleton */}
        <div className="h-10 lg:h-16 bg-gray-700 rounded-md w-3/4 mb-8" />

        {/* Date/Meta Skeleton */}
        <div className="h-4 bg-gray-800 rounded w-1/4 mb-10" />

        {/* Image Skeleton */}
        <div className="relative h-[400px] w-full mb-10 rounded-xl bg-gray-800" />

        {/* Content Skeleton */}
        <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
    </main>
);

export default BlogSkeleton;