import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { faThumbsUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation} from "react-router";
import { useState } from "react";
import { handleLikeClick } from "@/function/LikeFunction";

export default function NewsDetail(props: {user: any}) {
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

    return (
        <main className="w-screen flex justify-center items-start gap-3 p-8">
            <Button
                variant={"ghost"}
                onClick={() => navigate(-1)}
                className="hover:bg-[#f3f3f3] border-1 h-12 w-12 cursor-pointer"
            >
                <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </Button>

            <div className="content w-4xl">
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
                                onClick={(e) => handleLikeClick(e, news, news.likedByCurrentUser, setNews, 'single')}
                                variant={"ghost"}
                                className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    size="2xl"
                                    style={{
                                        color: news.likedByCurrentUser ? "#1659df" : "#dcdfe5",
                                        transition: "color 0.2s ease-in-out",
                                    }}
                                />
                                {news.likeCount > 0 && <span className="ml-2">{news.likeCount}</span>}
                            </Button>
                        ) : (
                            <div className="text-sm text-gray-500">Login to like this post</div>
                        )}
                    </CardFooter>
                </Card>

                {/* Show full content */}
                <div className="mt-4 whitespace-pre-line">{news.content}</div>
            </div>
        </main>
    );
}