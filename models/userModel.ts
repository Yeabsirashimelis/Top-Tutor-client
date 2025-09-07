import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    // --- Basic User Fields ---
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, "Name must have 40 characters or less"],
      minlength: [5, "Name must be at least 5 characters"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // allows unique but optional
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String, // optional since Google OAuth
    role: {
      type: String,
      enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      default: "STUDENT",
    },
    avatar: { type: String },

    // --- Instructor-specific fields ---
    bio: { type: String },
    title: { type: String },
    socialLinks: {
      type: Map,
      of: String, // e.g., { twitter: "url", linkedin: "url" }
    },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    totalCourses: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },

    totalEarnings: { type: Number, default: 0 }, // total earned
    availableEarnings: { type: Number, default: 0 }, // earnings available for payout
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
