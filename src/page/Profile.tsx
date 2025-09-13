import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Profile(props: { user: any; onLogout: () => void }) {
  const { user, onLogout } = props;

  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");

  return (
    <div className="flex w-screen justify-center items-start h-full p-24">
      {/* Sidebar Section */}
      <div className="flex flex-col items-center mr-10">
        {/* User Card */}
        <Card className="w-[18rem] border border-gray-300 rounded-xl shadow-md mb-6">
          <CardContent className="flex items-center gap-4">
            <img
              src="/vite.svg"
              alt="User Avatar"
              className="w-14 h-14 rounded-full border border-gray-300"
            />
            <div>
              <CardTitle className="text-lg font-semibold">
                {user?.user?.username || "Guest123"}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {user?.user?.gmail || "Guest123@gmail.com"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Nav */}
        <Card className="w-[18rem] h-[34rem] border border-gray-300 rounded-xl shadow-md">
          <CardContent className="flex flex-col gap-3">
            <Button
              variant="ghost"
              className={`justify-start text-base px-6 py-3 rounded-lg transition-all duration-150 ${
                activeTab === "profile"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Info
            </Button>
            <Button
              variant="ghost"
              className={`justify-start text-base px-6 py-3 rounded-lg transition-all duration-150 ${
                activeTab === "history"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Like History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="flex-1 h-[42rem] border border-gray-300 shadow-md rounded-xl py-0">
        <CardTitle className="px-8 py-5 text-3xl font-bold border-b border-gray-200 bg-gray-100 rounded-t-xl">
          {activeTab === "profile" ? "Profile" : "Like History"}
        </CardTitle>
        <CardContent className="px-10 py-6 text-lg overflow-y-auto">
          {activeTab === "profile" ? (
            <div className="flex flex-col gap-5">
              <div>
                <span className="font-semibold text-gray-700">Username: </span>
                {user?.user?.username || "Guest123"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email: </span>
                {user?.user?.gmail || "Guest123@gmail.com"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Password: </span>
                {user?.user?.password || "*****"}
              </div>

              <Button
                className="w-fit mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-2xl mb-4 text-gray-800">
                Recent Likes
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>How to build a multiplayer game in React</li>
                <li>Top 10 UI libraries for 2025</li>
                <li>Scaling Node.js with WebSockets</li>
                <li>Tailwind tips for responsive design</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
