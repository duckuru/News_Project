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

interface Post {
  id: string;
  headline: string;
  date: string;
  img?: string;
  likes?: number; // Assuming your post might have likes count from backend
  isLiked?: boolean; // Assuming your post might have liked status from backend
}

interface LikeState {
  [postId: string]: {
    isLiked: boolean;
    likeCount: number;
  };
}

export default function Home() {
  const [news, setNews] = useState<Post[]>([]);
  const [likeStates, setLikeStates] = useState<LikeState>({});
  const navigate = useNavigate();
  
  const { state: userState } = useContext(UserContext);
  const isAuth = !!userState.user;

  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    e.stopPropagation();
    
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const currentLikeState = likeStates[postId] || { isLiked: false, likeCount: 0 };
    const newIsLiked = !currentLikeState.isLiked;
    const newLikeCount = newIsLiked 
      ? currentLikeState.likeCount + 1 
      : currentLikeState.likeCount - 1;

    // Update local state immediately for better UX
    setLikeStates(prev => ({
      ...prev,
      [postId]: {
        isLiked: newIsLiked,
        likeCount: newLikeCount
      }
    }));

    try {
      // Call the appropriate backend endpoint
      const endpoint = newIsLiked ? 'like' : 'unlike';
      const response = await fetch(`http://localhost:8080/post/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ postId })
      });

      if (!response.ok) {
        // If the API call fails, revert the local state
        setLikeStates(prev => ({
          ...prev,
          [postId]: currentLikeState
        }));
        console.error('Like operation failed');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert local state on error
      setLikeStates(prev => ({
        ...prev,
        [postId]: currentLikeState
      }));
    }
  };

  // Initialize like states when news data is fetched
  useEffect(() => {
    if (news.length > 0) {
      const initialLikeStates: LikeState = {};
      news.forEach(post => {
        initialLikeStates[post.id] = {
          isLiked: post.isLiked || false,
          likeCount: post.likes || 0
        };
      });
      setLikeStates(initialLikeStates);
    }
  }, [news]);

  useEffect(() => {
    fetch('http://localhost:8080/post/')
      .then(res => res.json())
      .then((data: Post[]) => {
        console.log(data);
        setNews(data);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, []);

  return (
    <main className="home-page flex flex-col justify-center m-auto w-4xl overflow-hidden gap-3 p-8">
      {isAuth && userState.user && (
        <div className="welcome-message mb-4 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold">Welcome back, {userState.user.username}!</h2>
          <p className="text-sm text-gray-600">{userState.user.email}</p>
        </div>
      )}

      {news.map((post: Post) => {
        const postLikeState = likeStates[post.id] || { isLiked: false, likeCount: 0 };
        
        return (
          <Card
            key={post.id} 
            className="overflow-hidden cursor-pointer hover:bg-gray-100" 
            onClick={() => navigate(`/news/${post.headline}`, { state: { post } })}
          >
            <CardHeader>
              <CardTitle className="text-4xl">{post.headline}</CardTitle>
              <CardDescription>News description...</CardDescription>
              <CardAction>{post.date}</CardAction>
            </CardHeader>
            <CardContent>
              {post.img && (
                <img src={post.img} alt={post.headline} className="w-3xs m-auto" />
              )}
            </CardContent>
            
            {isAuth && (
              <CardFooter>
                <Button 
                  onClick={(e) => handleLikeClick(e, post.id)}
                  variant={"ghost"}
                  className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    size="2xl"
                    style={{ 
                      color: postLikeState.isLiked ? "#1659df" : "#dcdfe5",
                      transition: 'color 0.2s ease-in-out'
                    }}
                  />
                  {postLikeState.likeCount > 0 && (
                    <span className="ml-2">{postLikeState.likeCount}</span>
                  )}
                </Button>
              </CardFooter>
            )}
            
            {!isAuth && (
              <CardFooter>
                <div className="text-sm text-gray-500">
                  Login to like this post
                </div>
              </CardFooter>
            )}
          </Card>
        );
      })}
    </main>
  );
}