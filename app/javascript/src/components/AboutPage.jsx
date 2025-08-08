import React from "react";

import { Link } from "react-router-dom";

const AboutPage = () => (
  <div className="min-h-screen">
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          About BlogIt
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="mb-6 text-lg text-gray-600">
            BlogIt is a modern blogging platform designed to make sharing
            knowledge, stories, and insights as simple and beautiful as
            possible. We believe that everyone has a story worth telling and
            knowledge worth sharing.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">
            Our Mission
          </h2>
          <p className="mb-6 text-gray-600">
            To provide a clean, intuitive platform where writers can focus on
            what matters most - creating compelling content - while readers can
            discover and engage with diverse perspectives and ideas.
          </p>
          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">
            What We Offer
          </h2>
          <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600">
            <li>A clean, distraction-free writing experience</li>
            <li>Beautiful, responsive design that looks great on any device</li>
            <li>Easy content discovery and navigation</li>
            <li>Fast, reliable performance</li>
            <li>Community-driven content curation</li>
          </ul>
          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">
            Join Our Community
          </h2>
          <p className="mb-8 text-gray-600">
            Whether you're a seasoned writer or just getting started, BlogIt
            welcomes you. Share your thoughts, learn from others, and be part of
            a growing community of knowledge seekers and storytellers.
          </p>
          <div className="text-center">
            <Link
              className="mr-4 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              to="/posts"
            >
              Explore Posts
            </Link>
            <Link
              className="inline-block rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              to="/"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
