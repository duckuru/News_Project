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
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";

export default function Home() {

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  const handleLikeClick = (e: any) => {
    e.stopPropagation();
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };


  useEffect(() => {
    fetch('http://localhost:8080/post/')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setNews(data)
      });
  }, []);

  return (
    <main className="home-page flex flex-col justify-center m-auto w-4xl overflow-hidden gap-3 p-8">
      {/* ts screaming about type 'v' */}
      {news.map(v => {
        return (
          <Card className="overflow-hidden cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/news/${v.headline}`, { state: { post: v } })}>
            <CardHeader>
              <CardTitle className="text-4xl">{v.headline}</CardTitle>
              <CardDescription>News description...</CardDescription>
              <CardAction>{v.date}</CardAction> {/*this is date published */}
            </CardHeader>
            <CardContent>
              {/* <p>Card Content</p> */}
              {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
              <img src={v.img} alt="" className="w-3xs m-auto" />
            </CardContent>
            <CardFooter>
              <Button onClick={handleLikeClick}
                variant={"ghost"}
                className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer">
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  size="2xl"
                  // TODO: change like color when no like, or nah?
                  style={{ color: isLiked ? "#1659df" : "#dcdfe5" }}
                />
                {likeCount > 0 && <span>{likeCount}</span>}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </main>
  );
}
