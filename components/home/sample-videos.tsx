import { Card, CardContent } from "@/components/ui/card";

export default function SampleVideos() {
  return (
    <div className="mt-12 px-4 md:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 tracking-tight mb-6">
        SAMPLE TUTORIAL VIDEOS
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <video
                className="w-full h-full object-cover"
                controls
                preload="none"
                poster="/placeholder.svg?height=480&width=640"
              >
                <source src="/videos/v-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h3 className="font-medium mt-3">
              Freshman Mathematics Sample Videos
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Learn the basics of maths in this introductory tutorial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <video
                className="w-full h-full object-cover"
                controls
                preload="none"
                poster="/placeholder.svg?height=480&width=640"
              >
                <source src="/videos/v-2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h3 className="font-medium mt-3">Freshman Geography Course</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Learn geography and take your skills to the next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <video
                className="w-full h-full object-cover"
                controls
                preload="none"
                poster="/placeholder.svg?height=480&width=640"
              >
                <source src="/videos/v-3.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h3 className="font-medium mt-3">Freshman Psycology Course</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Learn the basics of human psycology
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
