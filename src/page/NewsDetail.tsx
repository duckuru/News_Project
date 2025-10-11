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
import { useEffect, useState } from "react";
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
    likedByCurrentUser: newsFromState?.likedByCurrentUser || false,
    likeCount: newsFromState?.likeCount || 0,
  });

  const [relatedNews, setRelatedNews] = useState();

  function generateNewsApiQuery(title) {
    const stopWords = new Set([
      "the", "is", "a", "an", "and", "of", "to", "in", "on", "for", "its", "this",
      "with", "by", "at", "from", "as", "are", "was", "be", "that", "it", "getting",
      "first", "live", "has", "have", "will", "their", "his", "her", "they", "-", "–"
    ]);

    const words = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '') // remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    const keywords = words.slice(0, 5); // limit to top 5
    const query = keywords.join(' '); // use space for NewsAPI q param (not +)

    return query;
  }


  // no need like, check same category, random get?
  const handleRelatedPost = async () => {

    const query = generateNewsApiQuery(news.headline);

    console.log(query)

    const res = fetch(`http://localhost:8080/post/search?query=${encodeURIComponent(query)}&category=all`, {
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
        setRelatedNews(processed.slice(1, 5));
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }

  useEffect(() => {
    handleRelatedPost();
  }, [news]);

  return (
    <main className="w-screen grid grid-cols-[15%_1fr_20%] gap-6 p-8">
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
        <h1 className="text-6xl font-bold">{news.headline}</h1>

        {news.date ? new Date(news.date).toLocaleString() : ""}

        {news.img && <img src={news.img} alt="" className="w-5xl m-auto" />}

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
                color: news?.likedByCurrentUser ? "#1659df" : "#dcdfe5",
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

        {/* Full Content */}
        <div className="mt-4 whitespace-pre-line text-xl">{news.content}</div>
      </div>

      {/* Right: Related News */}
      <div className="text-3xl font-bold flex justify-center flex-col">
        <h2 className="mb-2 flex text-center justify-center text-blue-600">Related News</h2>
        {relatedNews?.map(v =>
          <Card className="w-full sticky top-8 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200" onClick={() => {navigate(`/news/${v.headline}`, { state: { v } })}}>
            {/* Related content here */}
            <CardTitle className="font-semibold text-xl">{v.headline}</CardTitle>
            <CardContent>
              {v.img && <img src={v.img} alt="" className="w-[10rem] m-auto" />}
            </CardContent>
          </Card>
        )}
        {/* map over this for related post, up to 5 */}
      </div>
    </main>

  );
}
