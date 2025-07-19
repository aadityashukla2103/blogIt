import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                        About BlogIt
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-600 mb-6">
                            BlogIt is a modern blogging platform designed to make sharing knowledge,
                            stories, and insights as simple and beautiful as possible. We believe
                            that everyone has a story worth telling and knowledge worth sharing.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Our Mission
                        </h2>
                        <p className="text-gray-600 mb-6">
                            To provide a clean, intuitive platform where writers can focus on what
                            matters most - creating compelling content - while readers can discover
                            and engage with diverse perspectives and ideas.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            What We Offer
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                            <li>A clean, distraction-free writing experience</li>
                            <li>Beautiful, responsive design that looks great on any device</li>
                            <li>Easy content discovery and navigation</li>
                            <li>Fast, reliable performance</li>
                            <li>Community-driven content curation</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Join Our Community
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Whether you're a seasoned writer or just getting started, BlogIt welcomes
                            you. Share your thoughts, learn from others, and be part of a growing
                            community of knowledge seekers and storytellers.
                        </p>

                        <div className="text-center">
                            <Link
                                to="/posts"
                                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
                            >
                                Explore Posts
                            </Link>
                            <Link
                                to="/"
                                className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
