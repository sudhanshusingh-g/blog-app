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
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: [true, "Author is required"],
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
  status:{
    type:String,
    enum:['draft','published'],
    default:'draft'
  },
  tags:[{
    type:String,
    trim:true
  }],
  comments:[{
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    content:{
      type:String,
      required:true
    },
    date:{
      type:Date,
      default:Date.now
    }
  }]
},{
  timestamps:true
});

blogSchema.pre("save",function(next){
    this.title=this.title.charAt(0).toUpperCase()+this.title.slice(1);
    next();
});
blogSchema.post('save',async function(doc){
  if(this.isNew){
    const User=mongoose.model("User");
    await User.findByIdAndUpdate(
      this.author,
      {$addToSet:{blogs:this._id}}
    )
  }
});

blogSchema.pre('remove',async function(next){
  const User=mongoose.model('User');
  await User.findByIdAndUpdate(this.author, { $pull: { blogs: this._id } });
  next();
})

blogSchema.methods.publish = function () {
  this.status = "published";
  return this.save();
};

blogSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};
blogSchema.statics.findByAuthor = function (authorId) {
  return this.find({ author: authorId }).populate("author", "name email image");
};

const Blog=mongoose.model('Blog',blogSchema)

export default Blog;