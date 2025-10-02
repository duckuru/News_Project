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
import { faThumbsUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { handleLikeClick } from "@/function/LikeFunction";

export default function NewsDetail(props: { user: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = props; // current user passed as props
  const isAuth = !!user?.user;

  const newsFromState = location.state?.post;

  // Local state to manage like/unlike
  //this is a single news object, not a list
  const [news, setNews] = useState({
    ...newsFromState,
    likedByCurrentUser: newsFromState.likedByCurrentUser || false,
    likeCount: newsFromState.likeCount || 0,
  });

  // no need like, check same category, random get?
  const handleRelatedPost = async () => {
    const res = fetch(`http://localhost:8080/related-post}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then((data) => {
          console.log("Fetch related news", data);
          const processed = data.map((post: any, index: number) => ({
            ...post,
            tempId: post.id || `external-${index}`,
            likedByCurrentUser: post.likedByCurrentUser || false,
          }));
          setNews(processed);
        })
        .catch(error => {
          console.error('Error fetching news:', error);
        });
  }

  return (
<main className="w-screen grid grid-cols-[25%_50%_20%] gap-6 p-8">
  {/* Left: Back Button */}
  <div className="flex justify-end">
    <Button
      variant={"ghost"}
      onClick={() => navigate(-1)}
      className="hover:bg-[#f3f3f3] border-1 h-12 w-12 cursor-pointer"
    >
      <FontAwesomeIcon icon={faArrowLeft} size="xl" />
    </Button>
  </div>

  {/* Center: News Content */}
  <div className="content">
    <Card className="overflow-hidden cursor-pointer">
      <CardHeader>
        <CardTitle className="text-4xl">{news.headline}</CardTitle>
        <CardDescription>News description...</CardDescription>
        <CardAction>
          {news.date ? new Date(news.date).toLocaleString() : ""}
        </CardAction>
      </CardHeader>

      <CardContent>
        {news.img && <img src={news.img} alt="" className="w-3xs m-auto" />}
      </CardContent>

      <CardFooter>
        {isAuth ? (
          <Button
            onClick={(e) =>
              handleLikeClick(
                e,
                news,
                news.likedByCurrentUser,
                setNews,
                "single"
              )
            }
            variant={"ghost"}
            className=" hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faThumbsUp}
              size="2xl"
              style={{
                color: news.likedByCurrentUser ? "#1659df" : "#dcdfe5",
                transition: "color 0.2s ease-in-out",
              }}
            />
            {news.likeCount > 0 && (
              <span className="ml-2">{news.likeCount}</span>
            )}
          </Button>
        ) : (
          <div className="text-sm text-gray-500">
            Login to like this post
          </div>
        )}
      </CardFooter>
    </Card>

    {/* Full Content */}
    <div className="mt-4 whitespace-pre-line">{news.content}</div>
  </div>

  {/* Right: Related News */}
  <div className="text-3xl font-bold flex justify-center flex-col">
    <h2 className="mb-2 flex text-center justify-center">Related News</h2>
    {/* map over this for related post, up to 5 */}
    <Card className="w-full sticky top-8 p-4">
      {/* Related content here */}
      <CardTitle className="font-semibold text-xl">{news.headline}</CardTitle>
      <CardContent>
        {news.img && <img src={news.img} alt="" className="w-[10rem] m-auto" />}
      </CardContent>
    </Card>
  </div>
</main>

  );
}
