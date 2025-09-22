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
import { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { handleLikeClick } from "@/function/LikeFunction";
import { NewsContext } from "@/context/NewsContext";

export default function Home(props: { user: any; isLoading: any; }) {
  const { user, isLoading } = props;
  const {news, setNews} = useContext(NewsContext); //use context to set news when searching between the navbar and showing it on home page
  const navigate = useNavigate();

  const isAuth = !!user?.user;

  useEffect(() => {
    if (isLoading) return;

    fetch(`http://localhost:8080/post/?userId=${user?.user?.id || ''}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setNews(data);
        // dispatch({type: 'SET_NEWS', payload: data});
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, [user, isLoading]);

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
                onClick={(e) => handleLikeClick(e, post, post.likedByCurrentUser, setNews, 'multiple')}
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