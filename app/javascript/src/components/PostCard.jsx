import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post, variant = "default" }) => {
  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // Different card styles based on variant
  const cardStyles = {
    default: "border rounded-lg p-4 shadow-sm hover:shadow-md transition",
    featured: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6",
    compact: "border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors",
    list: "w-full border-b border-gray-200 py-8",
  };

  const titleStyles = {
    default: "text-lg font-semibold mb-1",
    featured: "text-xl font-semibold mb-3 text-gray-900 line-clamp-2",
    compact: "text-md font-semibold mb-1",
    list: "text-2xl font-bold mb-2 text-gray-900",
  };

  const descriptionStyles = {
    default: "text-sm text-gray-700 overflow-hidden",
    featured: "text-gray-600 mb-4 overflow-hidden",
    compact: "text-sm text-gray-600 overflow-hidden",
    list: "text-base text-gray-700 mb-2 overflow-hidden",
  };

  const dateStyles = {
    default: "mt-3 text-xs text-gray-500",
    featured: "text-sm text-gray-500",
    compact: "text-xs text-gray-500 mt-1",
    list: "text-xs text-gray-400",
  };

  // Custom line clamp styles
  const getLineClampStyle = lines => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  return (
    <div className={cardStyles[variant]}>
      <Link to={`/posts/${post.slug}`}>
        <h2 className={`${titleStyles[variant]} hover:text-blue-600 transition-colors`}>
          {post.title}
        </h2>
      </Link>
      <p
        className={descriptionStyles[variant]}
        style={getLineClampStyle(variant === "featured" ? 3 : 2)}
      >
        {post.description}
      </p>
      <div className="flex justify-between items-center">
        <span className={dateStyles[variant]}>{formatDate(post.created_at)}</span>
        {variant === "list" && (
          <Link
            to={`/posts/${post.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read More →
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostCard;
