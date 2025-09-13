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
import { useState } from "react";

export default function Home() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  return (
    <main className="home-page flex flex-col justify-center m-auto w-4xl overflow-hidden gap-3 p-8">
      {[...new Array(10)].map((_) => {
        return (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-4xl">Some news headline</CardTitle>
              <CardDescription>News description...</CardDescription>
              <CardAction>29/11/2025</CardAction> {/*this is date published */}
            </CardHeader>
            <CardContent>
              {/* <p>Card Content</p> */}
              {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
              <img src="/vite.svg" alt="" className="w-3xs m-auto" />
            </CardContent>
            <CardFooter>
                <Button onClick={handleLikeClick} 
                    variant={"ghost"}
                    className="hover:bg-transparent hover:text-[1.2rem]">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    size="2xl"
                    style={{ color: isLiked ? "#1659df" : "#dcdfe5" }}
                  />
                </Button>
                {likeCount > 0 && <span>{likeCount}</span>}
            </CardFooter>
          </Card>
        );
      })}
    </main>
  );
}
