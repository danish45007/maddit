import Link from "next/Link";
import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-24 h-24 mt-20 mb-10 bg-gray-600 rounded-full button"></div>
      <h1 className="mb-4 text-xl font-bold text-gray-800 mt-30">
        Sorry, there aren’t any communities on Maddit with that name.
      </h1>
      <p className="mt-10">
        This community may have been banned or the community name is incorrect.
      </p>
      <Link href="/">
        <a className="px-6 py-3 mt-5 rounded-full button blue">Go Home</a>
      </Link>
    </div>
  );
}

export default NotFound;
