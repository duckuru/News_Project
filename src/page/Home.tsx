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
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "@/context/UserContext";

// interface Post {
//   id: string;
//   headline: string;
//   date: string;
//   img?: string;
//   likes?: number; // Assuming your post might have likes count from backend
//   isLiked?: boolean; // Assuming your post might have liked status from backend
// }

// interface LikeState {
//   [postId: string]: {
//     isLiked: boolean;
//     likeCount: number;
//   };
// }

export default function Home(props: { user: any; isLoading: any; }) {
  const { user, isLoading } = props;
  const [news, setNews] = useState();
  const navigate = useNavigate();

  const isAuth = !!user?.user;

  useEffect(() => {
    if (isLoading) return;

    const userId = user?.user?.id; // could be undefined if not logged in

    fetch(`http://localhost:8080/post/?userId=${userId || ''}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setNews(data);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, [user, isLoading]);

  // Like/unlike handler
  const handleLikeClick = (e: React.MouseEvent, postId: number, liked: boolean) => {
    e.stopPropagation(); // prevent card navigation

    const url = `http://localhost:8080/post/${liked ? "unlike" : "like"}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ postId }),
    })
      .then((res) => {
        if (res.ok) {
          setNews((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                  ...p,
                  likedByCurrentUser: !liked,
                  likeCount: liked ? p.likeCount - 1 : p.likeCount + 1,
                }
                : p
            )
          );
        } else {
          res.text().then((msg) => console.error(msg));
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <main className="home-page flex flex-col justify-center m-auto w-4xl overflow-hidden gap-3 p-8">
      {isAuth && (
        <div className="welcome-message mb-4 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold">Welcome back, {user.user.username}!</h2>
          <p className="text-sm text-gray-600">{user.user.email}</p>
        </div>
      )}

      {news?.map((post) => (
        <Card
          key={post.id || post.headline} // fallback for API posts
          className="overflow-hidden cursor-pointer hover:bg-gray-100"
          onClick={() => navigate(`/news/${post.headline}`, { state: { post } })}
        >
          <CardHeader>
            <CardTitle className="text-4xl">{post.headline}</CardTitle>
            <CardDescription>{post.content}</CardDescription>
            <CardAction>
              {post.date ? new Date(post.date).toLocaleString() : ""}
            </CardAction>
          </CardHeader>

          <CardContent>
            {post.img && (
              <img src={post.img} alt={post.headline} className="w-3xs m-auto" />
            )}
          </CardContent>

          <CardFooter>
            {isAuth ? (
              <Button
                onClick={(e) => handleLikeClick(e, post.id, post.likedByCurrentUser)}
                variant="ghost"
                className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  size="2xl"
                  style={{
                    color: post.likedByCurrentUser ? "#1659df" : "#dcdfe5",
                    transition: "color 0.2s ease-in-out",
                  }}
                />
                {post.likeCount > 0 && <span className="ml-2">{post.likeCount}</span>}
              </Button>
            ) : (
              <div className="text-sm text-gray-500">Login to like this post</div>
            )}
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}