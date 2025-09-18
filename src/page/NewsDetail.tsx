import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { faThumbsUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation, useParams } from "react-router";
import { useState } from "react";

export default function NewsDetail(props: {user: any}) {
    const navigate = useNavigate();
    const location = useLocation();

    const user = props.user; // current user passed as props
    const isAuth = !!user?.user;

    const postFromState = location.state?.post;

    // Local state to manage like/unlike
    const [post, setPost] = useState({
        ...postFromState,
        likedByCurrentUser: postFromState.likedByCurrentUser || false,
        likeCount: postFromState.likeCount || 0,
    });

    const handleLikeClick = () => {
        if (!isAuth) return;

        const url = `http://localhost:8080/post/${post.likedByCurrentUser ? "unlike" : "like"}`;

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ postId: post.id }),
        })
            .then((res) => {
                if (res.ok) {
                    setPost((prev: { likedByCurrentUser: any; likeCount: number; }) => ({
                        ...prev,
                        likedByCurrentUser: !prev.likedByCurrentUser,
                        likeCount: prev.likedByCurrentUser
                            ? prev.likeCount - 1
                            : prev.likeCount + 1,
                    }));
                } else {
                    res.text().then((msg) => console.error(msg));
                }
            })
            .catch((err) => console.error(err));
    };

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
                        <CardTitle className="text-4xl">{post.headline}</CardTitle>
                        <CardDescription>News description...</CardDescription>
                        <CardAction>
                            {post.date ? new Date(post.date).toLocaleString() : ""}
                        </CardAction>
                    </CardHeader>

                    <CardContent>
                        {post.img && <img src={post.img} alt="" className="w-3xs m-auto" />}
                    </CardContent>

                    <CardFooter>
                        {isAuth ? (
                            <Button
                                onClick={handleLikeClick}
                                variant={"ghost"}
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

                {/* Show full content */}
                <div className="mt-4 whitespace-pre-line">{post.content}</div>
            </div>
        </main>
    );
}