import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="gradient-bg min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">

        {/* Heading */}
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Your Career Journey
        </h1>

        <p className="text-xl mb-12 opacity-90">
          Find your dream career path with our comprehensive guidance platform
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mb-16">
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 card-shadow"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Register
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {/* Card 1 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 card-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
            <p className="opacity-90">
              Get personalized career advice and direction
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 card-shadow">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
            <p className="opacity-90">
              Discover internships and career opportunities
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 card-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">CV Analysis</h3>
            <p className="opacity-90">
              AI-powered resume evaluation and improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
