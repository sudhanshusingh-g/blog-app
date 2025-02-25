import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minLength: [3, "Name should be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password should be at least 8 characters"],
    minLength: [8, "Password should be at least 8 characters"],
  },
  image: {
    type: String,
    default: function(){
      return `https://ui-avatars.com/api/?name=${this.name}&background=random&color=fff`;
    },
  },
  blogs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Blog'
  }]
},{
  timestamps:true,
});


userSchema.methods.addBlog=function(blogId){
  if(!this.blogs.includes(blogId)){
    this.blogs.push(blogId);
  }
  return this.save();
}

userSchema.methods.removeBlog = function (blogId) {
  this.blogs=this.blogs.filter(blog=>blog.toString() !== blogId.toString());
  return this.save();
};

export default mongoose.model("User",userSchema);