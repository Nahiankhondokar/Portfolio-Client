import { apiFetch } from "@/lib/api";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>;
};

// app/(main-portfolio)/_components/blog/BlogDetails.tsx

// Interface for your API response structure
interface BlogResponse {
    data: Blog;
}

export default async function BlogDetails({ params }: Props) {
    const { slug } = await params;

    let blog: Blog | null = null;
    try {
        const response = await apiFetch<BlogResponse>(`v1/public/blog-details/${slug}`);
        blog = response?.data;
    } catch (error) {
        console.error("Failed to fetch blog", error);
    }

    if (!blog) return notFound();

    return (
        <main className="max-w-4xl mx-auto py-20 px-6 min-h-screen">
            {/* Header / Meta */}
            <header className="mb-12">
                <div className="flex items-center gap-3 text-yellow-500 text-sm font-bold uppercase tracking-widest mb-4">
                    <span>Article</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">{blog.created_at}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6">
                    {blog.title}
                </h1>

                {blog.subtitle && (
                    <p className="text-xl text-gray-400 italic border-l-4 border-yellow-500 pl-6 py-2">
                        {blog.subtitle}
                    </p>
                )}
            </header>

            {/* Featured Image */}
            {blog.media && (
                <div className="relative h-[300px] md:h-[500px] w-full mb-16 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                        src={blog.media}
                        alt={blog.title}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
            )}

            {/* Professional Content Area */}
            <article className="prose prose-invert lg:prose-xl max-w-none 
                prose-headings:text-white prose-headings:font-black
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-strong:text-yellow-500
                prose-code:text-blue-400 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
                prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
                <div dangerouslySetInnerHTML={{ __html: blog.description || "" }} />
            </article>

            {/* Footer Navigation */}
            <footer className="mt-20 pt-10 border-t border-white/10">
                <a
                    href="/#blog" // Adjust this to point back to your blog section
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors font-bold uppercase text-sm"
                >
                    ← Back to Portfolio
                </a>
            </footer>
        </main>
    );
}