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
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { handleLikeClick } from "@/function/LikeFunction";

interface Post {
  id: string;
  headline: string;
  content: string;
  img?: string;
  likedByCurrentUser: boolean;
  likeCount: number;
}

export default function LikeHistory({ user }: { user: any }) {
  const [likedNews, setLikedNews] = useState<Post[]>([]);

  useEffect(() => {
    const fetchLikeHistory = () => {
      fetch(`http://localhost:8080/post/user/${user?.user?.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLikedNews(data);
        });
    };

    if (user.user) {
      fetchLikeHistory();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="font-semibold text-2xl mb-4 text-gray-800">
        Recent Likes
      </h2>
      <div className="space-y-6">
        {likedNews?.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-4xl">{p.headline}</CardTitle>
              <CardDescription>{p.content}</CardDescription>
              <CardAction>29/11/2025</CardAction>
            </CardHeader>
            <CardContent>
              {p.img && (
                <img src={p.img} alt="" className="w-3xs m-auto" />
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
                    setLikedNews,
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
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}