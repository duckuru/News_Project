import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { faThumbsUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation, useParams } from "react-router";

export default function NewsDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const post = location.state?.post;

    return (
        <main className="w-screen flex justify-center items-start gap-3 p-8">
            <Button variant={"ghost"} onClick={() => navigate(-1)} className="hover:bg-[#f3f3f3] border-1 h-12 w-12 cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft} size="xl"/>
            </Button>
            <div className="content w-4xl">
                <Card className="overflow-hidden cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-4xl">{post.headline}</CardTitle>
                        <CardDescription>News description...</CardDescription>
                        <CardAction>{post.date}</CardAction> {/*this is date published */}
                    </CardHeader>
                    <CardContent>
                        {/* <p>Card Content</p> */}
                        {/* we do img if theres any, ONLY IMG FROM API WE WONT DO IMG IN DB🙏 */}
                        <img src={post.img} alt="" className="w-3xs m-auto" />
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant={"ghost"}
                            className="hover:bg-transparent hover:text-[1.2rem] cursor-pointer">
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                size="2xl"
                            // TODO: change like color when no like, or nah?
                            //   style={{ color: isLiked ? "#1659df" : "#dcdfe5" }} 
                            />
                            {/* {likeCount > 0 && <span>{likeCount}</span>} */}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}