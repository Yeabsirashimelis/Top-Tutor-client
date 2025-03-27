import Link from "next/link";

export default function HomeTop() {
  return (
    <section className="relative w-[95%] mx-auto  bg-white py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute left-4 bottom-12 w-3 h-3 rounded-full bg-indigo-200"></div>
      <div className="absolute right-1/4 top-1/4 w-2 h-2 rounded-full bg-indigo-600"></div>
      <div className="absolute left-1/4 top-1/3 w-2 h-2 rounded-full bg-indigo-300"></div>
      <div className="absolute right-8 bottom-1/4 w-2 h-2 rounded-full bg-indigo-400"></div>

      <div className="">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Getting <span className="text-indigo-600">Quality</span> Education
              Is Now More <span className="text-indigo-600">Easy</span>
            </h1>
            <p className="text-gray-600 max-w-md">
              Provides you with the latest online learning system and material
              that help your knowledge growing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Get free trial
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Main circular background */}
            <div className="absolute inset-0 w-full h-full rounded-full border border-indigo-100 "></div>

            {/* Blue triangle shape */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-600 -rotate-12 rounded-sm"></div>

            {/* Light purple circle */}
            <div className="absolute right-8 bottom-8 w-24 h-24 bg-indigo-200 rounded-full"></div>

            {/* Small purple dot */}
            <div className="absolute right-4 top-4 w-4 h-4 bg-indigo-600 rounded-full"></div>

            {/* Student image */}
            <div className="relative z-10 flex justify-center">
              <img
                src="/images/girl-photo.png"
                alt="Student with thumbs up"
                className="object-contain w-[400px] h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
