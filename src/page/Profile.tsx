import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

export default function Profile(props: { user: any; onLogout: () => void; dispatch: any; isLoading: any }) {
  const { user, onLogout, dispatch, isLoading } = props;

  const [activeTab, setActiveTab] = useState<"post" | "profile" | "history">("post");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [conPassword, setConPassword] = useState('');

  const [post, setPost] = useState();
  const [likedPost, setLikedPost] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    //fetch user's post
    const fetchPostByAuthor = () => {
      fetch(`http://localhost:8080/post/author/${user?.user?.id}?userId=${user?.user?.id || ''}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setPost(data);
        });
    }
    //fetch user's like history
    const fetchLikeHistory = () => {
      fetch(`http://localhost:8080/post/user/${user?.user?.id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setLikedPost(data);
        })
    }

    if (isLoading) return;

    if (user.user) {
      setUsername(user?.user?.username);
      setPassword(user?.user?.password)
      fetchPostByAuthor();
      fetchLikeHistory();
    } else {
      navigate('/');
    }


  }, [user, isLoading]);

  const handleUpdateInfo = async () => {
    console.log(password, newPassword, conPassword)
    if (username && newPassword && conPassword) {
      if (newPassword == conPassword) {
        fetch(`http://localhost:8080/users/${user?.user?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ username: username, password: newPassword })
        }).then(res => res.json())
          .then(data => {
            console.log(data);
            dispatch({ type: 'SET_USER', payload: data })
            setNewPassword('');
            setConPassword('');
          });
      }
    }
  }

  const handleLikeClick = (postId: number, liked: boolean, tab: "post" | "history") => {
    if (!user?.user) return;

    const url = `http://localhost:8080/post/${liked ? "unlike" : "like"}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ postId }),
    })
      .then(res => {
        if (res.ok) {
          if (tab === "post") {
            // Update post tab
            setPost((prev: any) =>
              prev.map((p: any) =>
                p.id === postId
                  ? {
                    ...p,
                    likedByCurrentUser: !liked,
                    likeCount: liked ? p.likeCount - 1 : p.likeCount + 1,
                  }
                  : p
              )
            );

            // Add to likedPost if just liked
            if (!liked) {
              const likedItem = post?.find((p: any) => p.id === postId);
              if (likedItem) {
                setLikedPost((prev: any) => [
                  ...prev,
                  { ...likedItem, likedByCurrentUser: true, likeCount: likedItem.likeCount + 1 },
                ]);
              }
            } else {
              // Remove from likedPost if unliked
              setLikedPost((prev: any) => prev.filter((p: any) => p.id !== postId));
            }
          } else if (tab === "history") {
            // Remove immediately from history if unliked
            if (liked) {
              setLikedPost((prev: any) => prev.filter((p: any) => p.id !== postId));

              // Also update post tab
              setPost((prev: any) =>
                prev.map((p: any) =>
                  p.id === postId
                    ? { ...p, likedByCurrentUser: false, likeCount: p.likeCount - 1 }
                    : p
                )
              );
            }
          }
        } else {
          res.text().then(msg => console.error(msg));
        }
      })
      .catch(err => console.error(err));
  };

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
              <p className="text-sm text-gray-500">
                {/* {user?.user?.gmail || "Guest123@gmail.com"} */}
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
              onClick={() => { setActiveTab("post"); setUsername(user?.user?.username); }}
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
              onClick={() => { setActiveTab("history"); setUsername(user?.user?.username); }}
            >
              Like History
            </Button>
          </CardContent>
          <Button
            className="cursor-pointer w-fit mt-auto mb-5 justify-start ml-10 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
            onClick={() => { navigate('/'); onLogout() }}
          >
            Logout
          </Button>
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
                {post?.map(p => {
                  return (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-4xl">{p.headline}</CardTitle>
                        <CardDescription>{p.content}</CardDescription>
                        <CardAction>29/11/2025</CardAction> {/*this is date published */}
                      </CardHeader>
                      <CardContent>
                        {/* <p>Card Content</p> */}
                        {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                        {p.img ? <img src="/vite.svg" alt="" className="w-3xs m-auto" /> : <></>}
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={"ghost"}
                          onClick={() => handleLikeClick(p.id, p.likedByCurrentUser, "post")}
                          className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            size="2xl"
                            style={{ color: p.likedByCurrentUser ? "#1659df" : "#dcdfe5" }}
                          />
                          {p.likeCount > 0 && <span className="ml-2">{p.likeCount}</span>}
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
                    <Input value={username} onChange={e => setUsername(e.target.value)} />
                    {/* <Button onClick={handleEditUserName}>Submit</Button> */}
                  </div>
                  {/* <div>
                    <span className="font-semibold text-gray-700">Email: </span>
                    {user?.user?.gmail || "Guest123@gmail.com"}
                  </div> */}
                  <div>
                    <span className="font-semibold text-gray-700">Current Password: </span>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled />
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">New Password: </span>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">Confirm Password: </span>
                    <Input type="password" value={conPassword} onChange={e => setConPassword(e.target.value)} />
                  </div>

                  <Button className="mx-auto w-80 py-5 cursor-pointer" onClick={handleUpdateInfo}>Submit</Button>

                </div>
              ) : (
                <div>
                  <h2 className="font-semibold text-2xl mb-4 text-gray-800">
                    Recent Likes
                  </h2>
                  <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    {likedPost?.map(p => {
                      return (
                        <Card className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-4xl">{p.headline}</CardTitle>
                            <CardDescription>{p.content}</CardDescription>
                            <CardAction>29/11/2025</CardAction> {/*this is date published */}
                          </CardHeader>
                          <CardContent>
                            {/* <p>Card Content</p> */}
                            {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                            {p.img ? <img src="/vite.svg" alt="" className="w-3xs m-auto" /> : <></>}
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant={"ghost"}
                              onClick={() => handleLikeClick(p.id, p.likedByCurrentUser, "history")}
                              className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
                            >
                              <FontAwesomeIcon
                                icon={faThumbsUp}
                                size="2xl"
                                style={{ color: p.likedByCurrentUser ? "#1659df" : "#dcdfe5" }}
                              />
                              {p.likeCount > 0 && <span className="ml-2">{p.likeCount}</span>}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </ul>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
