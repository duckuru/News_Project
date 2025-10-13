import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { faThumbsUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { handleLikeClick } from "@/function/LikeFunction";

export default function NewsDetail({ user }: { user: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const newsFromState = location.state?.post;
  const isAuth = !!user?.user;

  const [news, setNews] = useState(() => ({
    ...newsFromState,
    likedByCurrentUser: newsFromState?.likedByCurrentUser || false,
    likeCount: newsFromState?.likeCount || 0,
  }));

  const [relatedNews, setRelatedNews] = useState([]);

  // 🧠 Update when navigating to a new related post
  useEffect(() => {
    if (location.state?.post) {
      const updatedPost = location.state.post;
      setNews({
        ...updatedPost,
        likedByCurrentUser: updatedPost.likedByCurrentUser || false,
        likeCount: updatedPost.likeCount || 0,
      });
      console.log(updatedPost);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state?.post]);

  // ✅ useCallback ensures the function is always re-bound to the latest `news`
  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      if (!isAuth) return;
      handleLikeClick(e, news, news.likedByCurrentUser, setNews, "single");
    },
    [isAuth, news] // 👈 depend on news so it rebinds whenever news changes
  );

  function generateNewsApiQuery(title: string) {
    const stopWords = new Set([
      "the",
      "is",
      "a",
      "an",
      "and",
      "of",
      "to",
      "in",
      "on",
      "for",
      "its",
      "this",
      "with",
      "by",
      "at",
      "from",
      "as",
      "are",
      "was",
      "be",
      "that",
      "it",
      "getting",
      "first",
      "live",
      "has",
      "have",
      "will",
      "their",
      "his",
      "her",
      "they",
      "-",
      "–",
    ]);

    //dont use word thats in the stopword to query
    const words = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    return words.slice(0, 5).join(" ");
  }

  //fetching related post function
  const handleRelatedPost = async (title: string) => {
    //this will get the query
    const query = generateNewsApiQuery(title);

    try {
      const res = await fetch(
        `http://localhost:8080/post/search?query=${encodeURIComponent(
          query
        )}&category=all`,
        { credentials: "include" }
      );
      const data = await res.json();
      const processed = data.map((post: any, index: number) => ({
        ...post,
        tempId: post.id || `external-${index}`,
        likedByCurrentUser: post.likedByCurrentUser || false,
      }));
      setRelatedNews(processed.slice(1, 5));
    } catch (err) {
      console.error("Error fetching related news:", err);
    }
  };

  useEffect(() => {
    if (news?.headline) {
      handleRelatedPost(news.headline);
    }
  }, [news.headline]);

  return (
    <main className="w-screen grid grid-cols-[15%_1fr_20%] gap-6 p-8">
      {/* Back Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-[#f3f3f3] h-12 w-12 cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="xl" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="content max-w-4xl">
        <h1 className="text-6xl font-bold">{news.headline}</h1>
        <span className="flex justify-between my-4">
          {news.author ? <h3 className="etxt-3xl font-semibold">Author: {news?.author}</h3>: ""}
          {/* <h3 className="etxt-3xl font-semibold">Author: {news?.author}</h3> */}
          {news.date && <p>Date: {new Date(news.date).toLocaleString()}</p>}
        </span>
        {news.img && <img src={news.img} alt="" className="w-5xl m-auto" />}

        {isAuth ? (
          <Button
            onClick={handleLike} // ✅ use the memoized callback
            variant="ghost"
            className="hover:bg-transparent cursor-pointer mt-4"
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
              <span className="">{news.likeCount}</span>
            )}
          </Button>
        ) : (
          <div className="text-sm text-gray-500">Login to like this post</div>
        )}

        <div className="mt-4 whitespace-pre-line text-xl">{news.content}</div>
      </div>

      {/* Related News */}
      <div className="text-3xl font-bold flex flex-col justify-start">
        <h2 className="mb-2 text-center text-blue-600">{relatedNews?.length == 0 ? '' : 'Related News'}</h2>

        {relatedNews.map((post) => (
          <Card
            key={post.tempId}
            className="w-full sticky top-8 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() =>
              navigate(`/news/${post.headline}`, { state: { post } })
            }
          >
            <CardTitle className="font-semibold text-xl">
              {post.headline}
            </CardTitle>
            <CardContent>
              {post.img && (
                <img src={post.img} alt="" className="w-[10rem] m-auto" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
