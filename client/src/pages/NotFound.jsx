import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg shadow-md 
                   hover:scale-105 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
