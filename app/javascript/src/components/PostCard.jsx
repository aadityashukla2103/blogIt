import React, { useState } from "react";

import { UpArrow, DownArrow } from "@bigbinary/neeto-icons";
import { Tag } from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Local state for votes
  const [netVotes, setNetVotes] = useState(post.net_votes);
  const [userVote, setUserVote] = useState(post.user_vote || null); // "upvote", "downvote", or null
  const [isBloggable, setIsBloggable] = useState(post.is_bloggable);

  const handleVoteChange = voteType => async () => {
    if (userVote === voteType) return;

    try {
      const response = await postsApi.vote({
        postId: post.id,
        voteType, // must be "upvote" or "downvote"
      });

      setNetVotes(response.data.net_votes);
      setUserVote(response.data.user_vote);
      setIsBloggable(response.data.is_bloggable);
    } catch {
      // handle error
    }
  };

  return (
    <div className="flex items-start justify-between border-b border-gray-200 py-6">
      {/* Left side - Post details */}
      <div>
        {/* Title */}
        <div className="flex gap-4">
          <Link to={`/posts/${post.slug}`}>
            <h2 className="text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600">
              {post.title}
            </h2>
          </Link>
          {isBloggable && <Tag label="Blog it" size="small" style="success" />}
        </div>
        {/* Categories */}
        {post.categories?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.categories.map((cat, idx) => (
              <span
                className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"
                key={idx}
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        {/* Author + Date */}
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">{post.author}</span>
          <span className="ml-2">{formatDate(post.created_at)}</span>
        </div>
      </div>
      {/* Voting Section */}
      <div className="flex flex-col items-center gap-1">
        <UpArrow
          size={40}
          className={`cursor-pointer ${
            userVote === "upvote" ? "text-gray-800" : "text-green-600"
          }`}
          onClick={handleVoteChange("upvote")}
        />
        <span className="text-2xl font-semibold">{netVotes}</span>
        <DownArrow
          size={40}
          className={`cursor-pointer ${
            userVote === "downvote" ? "text-gray-800" : "text-red-600"
          }`}
          onClick={handleVoteChange("downvote")}
        />
      </div>
    </div>
  );
};

export default PostCard;
