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
import { useNavigate, useLocation } from "react-router";
import { handleLikeClick } from "@/function/LikeFunction";
import { NewsContext } from "@/context/NewsContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home(props: { user: any; isLoading: any; }) {
  const { user, isLoading } = props;
  const { news, setNews } = useContext(NewsContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuth = !!user?.user;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    if (isLoading) return;

    if(!location.state?.query){
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
          setNews(processed);
        })
        .catch(error => {
          console.error('Error fetching news:', error);
        });
    }

  }, [user, isLoading]);

  // Calculate pagination data
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = news?.slice(indexOfFirstPost, indexOfLastPost) || [];
  const totalPages = Math.ceil((news?.length || 0) / postsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('ellipsis-start');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('ellipsis-end');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="home-page flex flex-col justify-center m-auto w-4xl overflow-hidden gap-3 p-8 flex-grow">
        {isAuth && (
          <div className="welcome-message mb-4 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold">Welcome back, {user.user.username}!</h2>
            <p className="text-sm text-gray-600">{user.user.email}</p>
          </div>
        )}

        {/* Posts Count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {currentPosts.length} of {news?.length || 0} posts
        </div>

        {currentPosts.map((post) => (
          <Card
            key={post.tempId}
            className="overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors duration-200"
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
                <img src={post.img} alt={post.headline} className="w-3xs m-auto max-w-full" />
              )}
            </CardContent>

            <CardFooter>
              {isAuth ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking like
                    handleLikeClick(e, post, post.likedByCurrentUser, setNews, 'multiple');
                  }}
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

        {/* Pagination Component */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}