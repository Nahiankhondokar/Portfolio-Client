// app/blog/[slug]/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CalendarDays, Clock, User } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useState } from "react";
import { Service } from "../interface/Service";
import fallbackImage from "../../../../../public/assets/img/fallbackimage.png";

 

export default function BlogDetailPage() {

  const [service, setService] = useState<Service | null>(null);

  // const fetchServices = async () => {
  //   const res = await fetch(`/api/services/${params.id}`);
  //   const data = await res.json();
  //   setService(data);
  // };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="overflow-hidden">
        {/* Blog Image */}
        <div className="relative aspect-image border bg-muted">
          {service && <Image
            src={fallbackImage}
            alt="service"
            width={400}
            height={200}
            className="object-cover w-full h-full"
          />}
           <Image src={fallbackImage} alt="blog" width={300} height={150} className="m-auto"/>
        </div>
        
        <CardContent className="p-6 md:p-8">
          {/* Blog Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Title
          </h1>
          
          {/* Blog Description */}
          <p className="text-lg text-muted-foreground mb-6">
            Description
          </p>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Date and Time */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {/* <span>{format(new Date(blog.publishedAt ?? ""), "MMM d, yyyy")}</span> */}
              <span>12:00 PM</span>
            </div>
            
            {/* Reading Time */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Read time</span>
            </div>
            
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="author" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">author name</span>
            </div>
          </div>
          
          {/* Content Section (placeholder) */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>This is where the full blog content would appear. The actual content would be fetched from your database or CMS.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          
          {/* Back Button */}
          <div className="mt-8 pt-6 border-t">
            <Button variant="outline">
              Back to Blogs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton
// export function BlogDetailSkeleton() {
//   return (
//     <div className="container mx-auto py-8 px-4 max-w-4xl">
//       <Card className="overflow-hidden">
//         <Skeleton className="aspect-video" />
//         <CardContent className="p-6 md:p-8">
//           <Skeleton className="h-10 w-3/4 mb-4" />
//           <Skeleton className="h-6 w-full mb-6" />
//           <div className="flex flex-wrap gap-4 mb-8">
//             <div className="flex items-center gap-2">
//               <Skeleton className="h-4 w-4" />
//               <Skeleton className="h-4 w-24" />
//             </div>
//             <div className="flex items-center gap-2">
//               <Skeleton className="h-4 w-4" />
//               <Skeleton className="h-4 w-20" />
//             </div>
//             <div className="flex items-center gap-2">
//               <Skeleton className="h-8 w-8 rounded-full" />
//               <Skeleton className="h-4 w-24" />
//             </div>
//           </div>
//           <div className="space-y-3">
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-5/6" />
//             <Skeleton className="h-4 w-4/6" />
//           </div>
//           <div className="mt-8 pt-6 border-t">
//             <Skeleton className="h-10 w-32" />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }