import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

function SingleBlog() {
  const {blog}=useSelector((state)=>state.blog);
  const {id}=useParams();
  const currentBlog=blog.filter((b)=>b._id === id);
  return (
    <div>{currentBlog.title}</div>
  )
}

export default SingleBlog