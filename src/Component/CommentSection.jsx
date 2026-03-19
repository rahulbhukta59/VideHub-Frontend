import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";

const CommentSection = ({ videoId }) => {

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  
  const fetchComments = async () => {
    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/video/${videoId}`
      );

      const data = await res.json();

      setComments(data.comments || []);

    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {

    const loadComments = async () => {
      await fetchComments();
    };

    loadComments();

  }, [videoId]);

  // ADD COMMENT
  const handleAddComment = async () => {

    if (!content.trim()) return;

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/add/${videoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ content })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setContent("");
        fetchComments();
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Error adding comment:", error);
    }

  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/delete/${commentId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (res.ok) {
        fetchComments();
      } else {
        const data = await res.json();
        alert(data.message);
      }

    } catch (error) {
      console.error("Error deleting comment:", error);
    }

  };

  return (
    <div className="mt-8">

      {/* COMMENT INPUT */}
      <div className="flex gap-3 mb-6">

        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 bg-white border border-gray-700 rounded-full outline-none"
        />

        <button
          onClick={handleAddComment}
          className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition"
        >
          Comment
        </button>

      </div>

      {/* COMMENTS */}
      <div className="space-y-5">

        {comments.map((c) => (

          <div key={c._id} className="flex justify-between items-start">

            <div className="flex gap-3">

              <img
                src={
                  c.owner?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                className="w-9 h-9 rounded-full"
                alt="profile"
              />

              <div>

                <p className="text-sm font-semibold">
                  {c.owner?.username || "User"}
                </p>

                <p className="text-sm text-gray-600">
                  {c.content}
                </p>

              </div>

            </div>

            {/* TRASH BUTTON */}
            <button
              onClick={() => handleDeleteComment(c._id)}
              className="text-gray-500 hover:text-red-600 transition cursor-pointer"
            >
              <CiTrash size={22} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default CommentSection;