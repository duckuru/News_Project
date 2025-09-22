export const handleLikeClick = (e: React.MouseEvent, post: any, liked: boolean, setter: any, data: any, likeSetter: any, news: any) => {
    e.stopPropagation(); // prevent card navigation

    const isExternal = !post.id;

    const url = isExternal ? 
    `http://localhost:8080/post/likeExternal`        
    : `http://localhost:8080/post/${liked ? "unlike" : "like"}`;

    const body = isExternal ? post : {postId: post.id};

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    })
        .then((res) => {
            if (res.ok) {
                //if the data is a list
                if (data == 'multiple') {
                    setter((prev) =>
                        prev.map((p) =>
                            p.id === post.id
                                ? {
                                    ...p,
                                    likedByCurrentUser: !liked,
                                    likeCount: liked ? p.likeCount - 1 : p.likeCount + 1,
                                }
                                : p
                        )
                    );
                    //in profile page, for setting user like history locally
                    if (likeSetter) {
                        if (!liked) {
                            const likedItem = news?.find((p: any) => p.id === post.id);
                            if (likedItem) {
                                likeSetter((prev: any) => [
                                    ...prev,
                                    { ...likedItem, likedByCurrentUser: true, likeCount: likedItem.likeCount + 1 },
                                ]);
                            }
                        } else {
                            likeSetter((prev: any) => prev.filter((p: any) => p.id !== post.id));
                        }
                    }
                } else { //if the data is single (the news detail)
                    setter((prev) => ({
                        ...prev,
                        likedByCurrentUser: !prev.likedByCurrentUser,
                        likeCount: prev.likedByCurrentUser
                            ? prev.likeCount - 1
                            : prev.likeCount + 1,
                    }));
                }
            } else {
                res.text().then((msg) => console.error(msg));
            }
        })
        .catch((err) => console.error(err));
};