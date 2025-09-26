import { useState, useEffect } from "react";
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
import { faPen, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
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
import { Input } from "@/components/ui/input";
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
import { handleLikeClick } from "@/function/LikeFunction";

interface Post {
  id: string;
  headline: string;
  content: string;
  category: string;
  img?: string;
  likedByCurrentUser: boolean;
  likeCount: number;
}

export default function ProfilePosts({ user }: { user: any }) {
  const [news, setNews] = useState<Post[]>([]);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [editPostOpen, setEditPostOpen] = useState(false);

  useEffect(() => {
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

    if (user.user) {
      fetchPostByAuthor();
    }
  }, [user]);

  const handleUpdatePost = async (id: string) => {
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
        setHeadline("");
        setContent("");
        setCategory("");
        setEditPostOpen(false);
        // Refresh posts
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
        fetchPostByAuthor();
      });
  };

  const handleDeletePost = (id: string) => {
    fetch(`http://localhost:8080/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Refresh posts after deletion
        setNews(news.filter(post => post.id !== id));
      });
  };

  return (
    <div className="py-10 flex flex-col gap-10">
      {news?.map((p) => (
        <Card key={p.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-4xl">{p.headline}</CardTitle>
            <CardDescription>{p.content}</CardDescription>
            <CardAction>29/11/2025</CardAction>
          </CardHeader>
          <CardContent>
            {p.img && (
              <img src="/vite.svg" alt="" className="w-3xs m-auto" />
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
                    "multiple"
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
                  setHeadline(p.headline);
                  setContent(p.content);
                  setCategory(p.category);
                  setEditPostOpen(!editPostOpen);
                }}
              >
                <DialogTrigger asChild>
                  <FontAwesomeIcon
                    icon={faPen}
                    style={{ color: "#3f3f3f" }}
                    className="cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center text-3xl">
                      Update Post
                    </DialogTitle>
                    <DialogDescription>
                      Update your post
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
                      onValueChange={setCategory}
                      value={category}
                    >
                      <SelectTrigger className="w-[12rem] border-2 h-12">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
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
                        onClick={() => handleUpdatePost(p.id)}
                        type="button"
                      >
                        Update
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button 
                className="bg-[#f3f3f3] text-[#3f3f3f] hover:bg-[#c5c5c5]" 
                onClick={() => handleDeletePost(p.id)}
              >
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}