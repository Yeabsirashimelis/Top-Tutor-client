import Image from "next/image";
import { Star, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  category: string;
  rating: number;
  photo: string;
}

export default function CourseCard({
  title,
  category,
  rating,
  photo,
}: CourseCardProps) {
  return (
    <Card className=" transition-all duration-300 hover:shadow-lg">
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
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
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
