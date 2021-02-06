import dayjs from "dayjs";
import Link from "next/Link";
import React from "react";
import { useAuthState } from "../context/auth";
// import { useState } from "react";
// import { io } from "socket.io-client";
import { Sub } from "../types";
// const socket = io("http://localhost:9000");

function Sidebar({ sub }: { sub: Sub }) {
  // TODO: Real time online user count client
  // const [onlineUser, setOnlineUser] = useState(0);
  // socket.on("userCount", function (data) {
  //   setOnlineUser(data.userCount);
  //   console.log("Online Users", data.userCount);
  // });
  // Global State
  const { authenticated, user } = useAuthState();
  return (
    <div className="ml-6 w-80">
      <div className="bg-white rounded">
        <div className="p-3 bg-blue-500 border-b-2 rounded-t">
          <p className="font-semibold text-center text-white">
            About Community
          </p>
        </div>
        <div className="p-3 mb-3 text-md">
          {sub.description}
          <div className="flex mt-3 mb-3 text-sm font-medium">
            <div className="w-1/2">
              <p>10K</p>
              <p>Members</p>
            </div>
            <div className="w-1/2">
              <p>21K</p>
              <p>Online</p>
            </div>
          </div>
          {/* Created-At section and create Post */}
          <p className="p-2 my-3 border-t-2 border-solid">
            <i className="mr-2 fas fa-birthday-cake"></i>
            Created {dayjs(sub.createdAt).format("D MMM YYYY")}
          </p>
          {authenticated && (
            <Link href={`/r/${sub.name}/submit`}>
              <a className="w-full py-1 text-sm rounded-full blue button">
                Create Post
              </a>
            </Link>
          )}
          <p className="p-3 mt-3 border-t-2 border-solid cursor-pointer">
            Community options
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
