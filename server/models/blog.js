import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minLength: [3, "Title must be at least 3 characters"],
    unique:true
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    minLength: [3, "Title must be at least 3 characters"],
    maxLength: [100, "Title must be less than 100 character"],
  },
  body: {
    type: String,
    required: [true, "Body content is required"],
    minLength: [10, "Body must be at least 10 characters"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  hidden: {
    type: Boolean,
    required: true,
    default: false,
  },
  meta: {
    votes: {
      type: Number,
      min: [0, "Votes cannot be negative"],
      default: 0,
    },
    favs: {
      type: Number,
      min: [0, "Favs cannot be negative"],
      default: 0,
    },
  },
});

blogSchema.pre("save",function(next){
    this.title=this.title.charAt(0).toUpperCase()+this.title.slice(1);
    next();
});

const Blog=mongoose.model('Blog',blogSchema)

export default Blog;