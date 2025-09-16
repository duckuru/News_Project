import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

export default function Profile(props: { user: any; onLogout: () => void; dispatch: any;}) {
  const { user, onLogout, dispatch } = props;

  const [activeTab, setActiveTab] = useState<"post" | "profile" | "history">("post");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // const getLikeHIstory = async () => {
    //   fetch("/")
    // }
  })

  const handleEditUserName = async () => {
    fetch(`http://localhost:8080/users/${user?.user?.id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username: username})
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        dispatch({type: 'SET_USER', payload: data})
      });
    
  }

  const handleEditPassword = async () => {
    fetch(`http://localhost:8080/users/${user?.user?.id}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ password: password})
        }).then(res => res.json())
          .then(data => {
            console.log(data);
            dispatch({type: 'SET_USER', payload: data})
          });
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
              className={`justify-start text-base px-6 py-3 rounded-lg transition-all duration-150 ${activeTab === "post"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("post")}
            >
              Post
            </Button>
            <Button
              variant="ghost"
              className={`justify-start text-base px-6 py-3 rounded-lg transition-all duration-150 ${activeTab === "profile"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Info
            </Button>
            <Button
              variant="ghost"
              className={`justify-start text-base px-6 py-3 rounded-lg transition-all duration-150 ${activeTab === "history"
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
          {activeTab === "post" ? "Post" : activeTab === "profile" ? "Profile" : "Like History"}
        </CardTitle>
        <CardContent className="px-15 text-lg overflow-y-auto">
          {activeTab === "post" ?
            (
              <div className="py-10 flex flex-col gap-10">
                {[...new Array(3)].map(_ => {
                  return (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-4xl">Some news headline</CardTitle>
                        <CardDescription>News description...</CardDescription>
                        <CardAction>29/11/2025</CardAction> {/*this is date published */}
                      </CardHeader>
                      <CardContent>
                        {/* <p>Card Content</p> */}
                        {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                        <img src="/vite.svg" alt="" className="w-3xs m-auto" />
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={"ghost"}
                          className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer">
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            size="2xl"
                          // style={{ color: isLiked ? "#1659df" : "#dcdfe5" }}
                          />
                          {/* {likeCount > 0 && <span>{likeCount}</span>} */}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )
            :
            activeTab === "profile" ?
              (
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="font-semibold text-gray-700 ">Username: </span>
                    {user?.user?.username || "Guest123"}
                    .......... {user?.user?.id}
                    <Input placeholder={user?.user?.username} onSubmit={handleEditUserName} value={username} onChange={e=>setUsername(e.target.value)}/>
                    <Button onClick={handleEditUserName}>Submit</Button>
                  </div>
                  {/* <div>
                    <span className="font-semibold text-gray-700">Email: </span>
                    {user?.user?.gmail || "Guest123@gmail.com"}
                  </div> */}
                  <div>
                    <span className="font-semibold text-gray-700">Password: </span>
                    **********
                    <Input placeholder="******" onSubmit={handleEditPassword}  value={password} onChange={e=>setPassword(e.target.value)}/>
                    <Button onClick={handleEditPassword}>Submit</Button>
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
