import React from "react";
import { Fragment } from "react";

function LoadingPage() {
  return (
    <Fragment>
      <div className="w-full max-w-sm p-4 mx-auto border rounded-md shadow border-light-blue-300">
        <div className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-light-blue-400"></div>
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-light-blue-400"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-light-blue-400"></div>
              <div className="w-5/6 h-4 rounded bg-light-blue-400"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm p-4 mx-auto mt-4 border rounded-md shadow border-light-blue-300">
        <div className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-light-blue-400"></div>
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-light-blue-400"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-light-blue-400"></div>
              <div className="w-5/6 h-4 rounded bg-light-blue-400"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm p-4 mx-auto mt-4 border rounded-md shadow border-light-blue-300">
        <div className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-light-blue-400"></div>
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-light-blue-400"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-light-blue-400"></div>
              <div className="w-5/6 h-4 rounded bg-light-blue-400"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm p-4 mx-auto mt-4 border rounded-md shadow border-light-blue-300">
        <div className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-light-blue-400"></div>
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-light-blue-400"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-light-blue-400"></div>
              <div className="w-5/6 h-4 rounded bg-light-blue-400"></div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default LoadingPage;
