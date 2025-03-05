import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    body: {
      type: String,
      required: [true, "Body content is required"],
      minLength: [10, "Body must be at least 10 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    reactions: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 30,
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save",function(next){
    this.title=this.title.charAt(0).toUpperCase()+this.title.slice(1);
    next();
});
blogSchema.post("save", async function (doc) {
  if (doc.isNew) {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(
      doc.author,
      { $addToSet: { blogs: doc._id } }, 
      { new: true }
    );
  }
});


blogSchema.pre("remove", async function (next) {
  const User = mongoose.model("User");
  await User.findByIdAndUpdate(this.author, { $pull: { blogs: this._id } });
  next();
});



blogSchema.methods.addComment = async function (userId, content) {
  this.comments.push({ user: userId, content });
  await this.save();
};
blogSchema.statics.findByAuthor = function (authorId) {
  return this.find({ author: authorId }).populate("author", "name email image");
};


export default mongoose.model("Blog", blogSchema);
