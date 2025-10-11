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
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

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
        {likedNews?.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() =>
              navigate(`/news/${post.headline}`, { state: { post } })
            }>
            <CardHeader>
              <CardTitle className="text-4xl">{post.headline}</CardTitle>
              <CardDescription>{post.content}</CardDescription>
              <CardAction>29/11/2025</CardAction>
            </CardHeader>
            <CardContent>
              {post.img && <img src={post.img} alt="" className="w-3xs m-auto" />}
            </CardContent>
            <CardFooter>
              <Button
                variant={"ghost"}
                onClick={(e) =>
                  handleLikeClick(
                    e,
                    post,
                    post.likedByCurrentUser,
                    setLikedNews,
                    "multiple",
                    setLikedNews
                  )
                }
                className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  size="2xl"
                  style={{
                    color: post.likedByCurrentUser ? "#1659df" : "#dcdfe5",
                  }}
                />
                {post.likeCount > 0 && <span className="ml-2">{post.likeCount}</span>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
