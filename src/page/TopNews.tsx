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
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { handleLikeClick } from "@/function/LikeFunction";
import { NewsContext } from "@/context/NewsContext";

export default function TopNews(props: { user: any; isLoading: any; }) {
  const { user, isLoading } = props;
  const { news, setNews } = useContext(NewsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const query = searchParam?.get("query");

  const isAuth = !!user?.user;

  useEffect(() => {
    if (isLoading) return;

    if (!query) {
      fetch(`http://localhost:8080/post/?userId=${user?.user?.id || ''}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then((data) => {
          console.log("Fetch news", data);
          const processed = data.map((post: any, index: number) => ({
            ...post,
            tempId: post.id || `external-${index}`,
            likedByCurrentUser: post.likedByCurrentUser || false,
          }));
          setNews(processed.slice(0, 12));
        })
        .catch(error => {
          console.error('Error fetching news:', error);
        });
    }

  }, [user, isLoading, query]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="home-page flex flex-col justify-center items-center overflow-hidden gap-3 p-8">
        <div className="flex justify-center items-center">
          <h1 className="text-7xl font-bold">TOP NEWS</h1>
        </div>

        {/* Posts Count, added condition to make it not show text on refresh(load with the news instead) */}
        <div className="grid grid-cols-3 w-full h-full p-4 gap-8">
          {news?.map((post) => (
            <Card
              key={post.tempId}
              className="overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-[30rem] h-[25rem] relative"
              onClick={() => navigate(`/news/${post.headline}`, { state: { post } })}
            >
              <CardHeader>
                <CardTitle className="text-3xl">
                  {post.headline.split(" ").length > 8
                    ? post.headline.split(" ").slice(0, 8).join(" ") + "..."
                    : post.headline}
                </CardTitle>
                <CardDescription>
                  {post.content.split(" ").slice(0, 20).join(" ")}{/* show first 20 words */}
                </CardDescription>
              </CardHeader>


              <CardContent className="absolute bottom-16 left-22">
                {post.img && (
                  <img src={post.img} alt={post.headline} className="w-3xs m-auto max-w-full" />
                )}
              </CardContent>

              {/* <CardFooter className="relative"> */}
              {isAuth ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking like
                    handleLikeClick(e, post, post.likedByCurrentUser, setNews, 'multiple');
                  }}
                  variant="ghost"
                  className="bottom-4 left-3 absolute hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
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
              <div className="absolute right-5 bottom-5 z-20">
                {post.date && new Date(post.date).toLocaleString()}
              </div>
              {/* </CardFooter> */}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}