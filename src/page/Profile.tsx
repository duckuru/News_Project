import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";
import ProfileInfo from "@/components/ProfileInfo";
import LikeHistory from "@/components/LikeHistory";

export default function Profile(props: {
  user: any;
  onLogout: () => void;
  dispatch: any;
  isLoading: any;
}) {
  const { user, onLogout, dispatch, isLoading } = props;

  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user.user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                {user?.user?.username}
              </CardTitle>
              <p className="text-sm text-gray-500"></p>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Nav */}
        <Card className="w-[18rem] h-[28rem] border border-gray-300 rounded-xl shadow-md">
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
          <Button
            className="cursor-pointer w-fit mt-auto mb-5 justify-start ml-10 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
            onClick={() => {
              navigate("/");
              onLogout();
            }}
          >
            Logout
          </Button>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="flex-1 h-[42rem] border border-gray-300 shadow-md rounded-xl py-0">
        <CardTitle className="px-8 py-5 text-3xl font-bold border-b border-gray-200 bg-gray-100 rounded-t-xl">
          {activeTab === "profile" ? "Profile" : "Like History"}
        </CardTitle>
        <CardContent className="px-15 text-lg overflow-y-auto">
          {activeTab === "profile" ? (
            <ProfileInfo user={user} dispatch={dispatch} />
          ) : (
            <LikeHistory user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
