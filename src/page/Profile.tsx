import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { handleLikeClick } from "@/function/LikeFunction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Profile(props: {
  user: any;
  onLogout: () => void;
  dispatch: any;
  isLoading: any;
}) {
  const { user, onLogout, dispatch, isLoading } = props;

  const [activeTab, setActiveTab] = useState<"post" | "profile" | "history">(
    "post"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const [content, setContent] = useState("");
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("");
  // const [postCategory, setPostCategory] = useState("");
  const [editPostOpen, setEditPostOpen] = useState(false);

  const [news, setNews] = useState();
  const [likedNews, setLikedNews] = useState(); //state to track user liked post

  const navigate = useNavigate();

  const handleUpdatePost = async (id) => {
    // try {
      fetch(`http://localhost:8080/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ headline, content, category }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // dispatch({ type: 'SET_USER', payload: data })
          setHeadline("");
          setContent("");
          setCategory("");
        });
    // } catch (error: any) {}
  };

    //   const fetchPostByAuthor = () => {
    //   fetch(
    //     `http://localhost:8080/post/author/${user?.user?.id}?userId=${
    //       user?.user?.id || ""
    //     }`,
    //     {
    //       credentials: "include",
    //     }
    //   )
    //     .then((res) => res.json())
    //     .then((data) => {
    //       setNews(data);
    //     });
    // };

  useEffect(() => {
    //fetch user's post

    const fetchPostByAuthor = () => {
      fetch(
        `http://localhost:8080/post/author/${user?.user?.id}?userId=${
          user?.user?.id || ""
        }`,
        {
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setNews(data);
        });
    };
    //fetch user's like history
    const fetchLikeHistory = () => {
      fetch(`http://localhost:8080/post/user/${user?.user?.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLikedNews(data);
        });
    };

    if (isLoading) return;

    if (user.user) {
      setUsername(user?.user?.username);
      setPassword(user?.user?.password);
      fetchPostByAuthor();
      fetchLikeHistory();
    } else {
      navigate("/");
    }
  }, [user, isLoading]);

  const handleUpdateInfo = async () => {
    console.log(password, newPassword, conPassword);
    if (username && newPassword && conPassword) {
      if (newPassword == conPassword) {
        fetch(`http://localhost:8080/users/${user?.user?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: username, password: newPassword }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            dispatch({ type: "SET_USER", payload: data });
            setNewPassword("");
            setConPassword("");
          });
      }
    }
  };

  const handleDeletePost = (id) => {
    fetch(`http://localhost:8080/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        // body: JSON.stringify({ headline, content, category }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // window.location.reload();
        });
        
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
              className={`justify-start text-base px-6 py-3 rounded-lg transition-all duration-150 ${
                activeTab === "post"
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("post");
                setUsername(user?.user?.username);
              }}
            >
              Post
            </Button>
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
              onClick={() => {
                setActiveTab("history");
                setUsername(user?.user?.username);
              }}
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
          {activeTab === "post"
            ? "Post"
            : activeTab === "profile"
            ? "Profile"
            : "Like History"}
        </CardTitle>
        <CardContent className="px-15 text-lg overflow-y-auto">
          {activeTab === "post" ? (
            <div className="py-10 flex flex-col gap-10">
              {news?.map((p) => {
                return (
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-4xl">{p.headline}</CardTitle>
                      <CardDescription>{p.content}</CardDescription>
                      <CardAction>29/11/2025</CardAction>{" "}
                      {/*this is date published */}
                    </CardHeader>
                    <CardContent>
                      {/* <p>Card Content</p> */}
                      {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                      {p.img ? (
                        <img src="/vite.svg" alt="" className="w-3xs m-auto" />
                      ) : (
                        <></>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="space-x-4">
                      <Button
                        variant={"ghost"}
                        onClick={(e) =>
                          handleLikeClick(
                            e,
                            p,
                            p.likedByCurrentUser,
                            setNews,
                            "multiple",
                            setLikedNews,
                            news
                          )
                        }
                        className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          size="2xl"
                          style={{
                            color: p.likedByCurrentUser ? "#1659df" : "#dcdfe5",
                          }}
                        />
                        {p.likeCount > 0 && (
                          <span className="ml-2">{p.likeCount}</span>
                        )}
                      </Button>

                      <Dialog
                        open={editPostOpen}
                        onOpenChange={() => {
                          setHeadline(p.headline)
                          setContent(p.content)
                          setCategory(p.category);
                          console.log(p);
                          setEditPostOpen(!editPostOpen);
                        }}
                      >
                        <DialogTrigger asChild>
                          <FontAwesomeIcon
                            icon={faPen}
                            style={{ color: "#3f3f3f" }}
                          />
                          {/* <Button variant="outline" className="text-xl px-6 py-3 mr-3" onClick={() => setLoginOpen(true)}>Login</Button> */}
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-center text-3xl">
                              Update Post
                            </DialogTitle>
                            <DialogDescription>
                              Upload your Post
                            </DialogDescription>
                          </DialogHeader>

                          <form className="text-[#3f3f3f] grid gap-4">
                            <div className="grid gap-3">
                              <Label htmlFor="news-headline">Headline</Label>
                              <Input
                                id="news-headline"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                autoFocus
                                maxLength={60}
                              />
                            </div>
                            <Select
                              onValueChange={(value) => setCategory(value)} value={category}
                            >
                              <SelectTrigger className="w-[12rem] border-2 h-12">
                                <SelectValue placeholder="Select a Category" defaultValue={p.category}/>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Categories</SelectLabel>
                                  <SelectItem value="business">
                                    Business
                                  </SelectItem>
                                  <SelectItem value="entertainment">
                                    Entertainment
                                  </SelectItem>
                                  <SelectItem value="general">
                                    General
                                  </SelectItem>
                                  <SelectItem value="health">Health</SelectItem>
                                  <SelectItem value="science">
                                    Science
                                  </SelectItem>
                                  <SelectItem value="sports">Sports</SelectItem>
                                  <SelectItem value="technology">
                                    Technology
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <div className="grid gap-3">
                              <Label htmlFor="news-content">Content</Label>
                              <Textarea
                                id="news-content"
                                className="resize-none"
                                maxLength={300}
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                              />
                            </div>
                            <DialogFooter className="grid gap-2 w-full">
                              <Button
                                className="w-full p-3"
                                onClick={ () =>{handleUpdatePost(p.id)}}
                              >
                                Update
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button className="bg-[#f3f3f3] text-[#3f3f3f] hover:bg-[#c5c5c5]" onClick={ () => {handleDeletePost(p.id)}}>Delete</Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : activeTab === "profile" ? (
            <div className="flex flex-col gap-5">
              <div>
                <span className="font-semibold text-gray-700 ">Username: </span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {/* <Button onClick={handleEditUserName}>Submit</Button> */}
              </div>
              {/* <div>
                    <span className="font-semibold text-gray-700">Email: </span>
                    {user?.user?.gmail || "Guest123@gmail.com"}
                  </div> */}
              <div>
                <span className="font-semibold text-gray-700">
                  Current Password:{" "}
                </span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled
                />
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  New Password:{" "}
                </span>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Confirm Password:{" "}
                </span>
                <Input
                  type="password"
                  value={conPassword}
                  onChange={(e) => setConPassword(e.target.value)}
                />
              </div>

              <Button
                className="mx-auto w-80 py-5 cursor-pointer"
                onClick={handleUpdateInfo}
              >
                Submit
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-2xl mb-4 text-gray-800">
                Recent Likes
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                {likedNews?.map((p) => {
                  return (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-4xl">{p.headline}</CardTitle>
                        <CardDescription>{p.content}</CardDescription>
                        <CardAction>29/11/2025</CardAction>{" "}
                        {/*this is date published */}
                      </CardHeader>
                      <CardContent>
                        {/* <p>Card Content</p> */}
                        {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                        {p.img ? (
                          <img src={p.img} alt="" className="w-3xs m-auto" />
                        ) : (
                          <></>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={"ghost"}
                          onClick={(e) =>
                            handleLikeClick(
                              e,
                              p,
                              p.likedByCurrentUser,
                              setNews,
                              "multiple",
                              setLikedNews,
                              news
                            )
                          }
                          className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            size="2xl"
                            style={{
                              color: p.likedByCurrentUser
                                ? "#1659df"
                                : "#dcdfe5",
                            }}
                          />
                          {p.likeCount > 0 && (
                            <span className="ml-2">{p.likeCount}</span>
                          )}
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
