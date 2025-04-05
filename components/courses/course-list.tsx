import CourseCard from "../home/course-card";

export default function CourseList() {
  const data = [
    {
      id: 1,
      photo: "/images/math",
      category: "Maths",
      title: "Freshman Mathematics",
      instructorName: "Amanuel Sisay",
      rating: 4.9,
    },
    {
      id: 2,

      photo: "/images/physics",
      category: "Physics",
      title: "Freshman Physics",
      instructorName: "Amanuel Sisay",
      rating: 4.8,
    },
    {
      id: 3,

      photo: "/images/logic",
      category: "Logic",
      title: "Logic and Critical Thinking",
      instructorName: "Amanuel Sisay",
      rating: 5,
    },
    {
      id: 4,

      photo: "/images/psycology",
      category: "Psycology",
      title: "Freshman Psycology",
      instructorName: "Amanuel Sisay",
      rating: 4.9,
    },
    {
      id: 5,
      photo: "/images/geography",
      category: "Geography",
      title: "Freshman Geography",
      instructorName: "Amanuel Sisay",
      rating: 4.7,
    },
    {
      id: 6,
      photo: "/images/english",
      category: "English",
      title: "Freshman English",
      instructorName: "Amanuel Sisay",
      rating: 4.5,
    },
  ];

  return (
    <div className="mt-8">
      <div className="w-[95%] mx-auto px-4 py-3">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 tracking-tight mb-6">
            POPULAR COURSES FOR YOU
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 w-full mx-auto gap-4 px-6 mt-8">
          {data.map((d) => (
            <CourseCard {...d} key={d.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
