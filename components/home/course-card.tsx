"use client";

import Image from "next/image";
import { Star, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  id: number;
  title: string;
  category: string;
  rating: number;
  photo: string;
  instructorName: string;
}

export default function CourseCard({
  id,
  title,
  category,
  rating,
  photo,
  instructorName,
}: CourseCardProps) {
  const router = useRouter();

  return (
    <Card
      className=" transition-all duration-300 hover:shadow-lg"
      onClick={() => router.push(`/courses/${id}`)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative h-48 w-full">
          <Image src={photo} alt={title} fill className="object-cover" />
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-white/80 hover:bg-white/80 text-primary font-medium"
          >
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 py-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <h3 className="text-indigo-800 mt-3">instructor:{instructorName}</h3>
      </CardContent>
      <CardFooter className="px-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p>Rating: </p>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-muted-foreground">
              {rating.toFixed(1)}
            </span>{" "}
            {/* Ensures rating has 1 decimal */}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
