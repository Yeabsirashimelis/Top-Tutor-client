export type Instructor = {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  reviewsCount: number;
  totalStudents: number;
  rating: number;
  avatar: string;
};

export type Lecture = {
  _id: string;
  title: string;
  order: number;
  lectureDuration: number;
  videoUrl?: string;
  resources?: { name: string; type: "file" | "link"; url: string }[];
};

export type Section = {
  _id: string;
  title: string;
  order: number;
  sectionDuration: number;
  lectures: Lecture[];
};

export type QuizOption = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  questionText: string;
  options: QuizOption[];
  explanation?: string;
};

export type Quiz = {
  _id: string;
  title: string;
  section: string; // section ID
  order: number;
  questions: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
};

export type Course = {
  _id: string;
  title: string;
  courseType: string;
  coverImage: string;
  description: string;
  price: number;
  language: string;
  skillLevel: string;
  courseDuration: number;
  learningOutcomes: string[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
  instructor: Instructor;
  sections: Section[];
  quizzes?: Quiz[];
  resources?: { name: string; type: "file" | "link"; url: string }[];
};

export type Note = {
  _id: string;
  userId: string;
  courseId: string;
  sectionId: string;
  lectureId: string;
  content: string;
  createdAt: Date;
};
