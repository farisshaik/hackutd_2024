import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);

  // Fetch posts from your backend or Pinata
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/blogs");
        setPosts(response.data.posts); // Assumes response contains a `posts` array
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    setMedia(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    media.forEach((file) => formData.append("media", file));

    try {
      const response = await axios.post("/api/upload", formData); // Replace with your upload endpoint
      console.log("Blog post uploaded. IPFS CID:", response.data.cid);
      // Fetch updated posts
      setPosts((prevPosts) => [
        ...prevPosts,
        {
          id: response.data.cid,
          title,
          content,
          media: response.data.mediaUrls,
        },
      ]);
      setTitle("");
      setContent("");
      setMedia([]);
    } catch (error) {
      console.error("Error uploading blog post:", error);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full lg:w-3/5 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog Page</h1>

        {/* Upload Form */}
        <div className="mb-8 p-6 border border-gray-300 rounded-lg bg-white shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add a New Post</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-4 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 mb-4 border rounded"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="mb-4"
              onChange={handleFileChange}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Upload
            </button>
          </form>
        </div>

        {/* Blog Posts */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              {post.media &&
                post.media.map((url, index) => (
                  <div key={index} className="mb-4">
                    <img
                      src={url}
                      alt={`Media ${index}`}
                      className="w-full rounded-lg"
                    />
                  </div>
                ))}
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;