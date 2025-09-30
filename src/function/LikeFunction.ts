export const handleLikeClick = (e: React.MouseEvent, post: any, liked: boolean, setter: any, data: any, likeSetter: any, news: any) => {
    e.stopPropagation(); // prevent card navigation

    const isExternal = !post.id;
    let url = '';
    let body = null;
    let method = 'POST';

    if(isExternal){
        url = 'http://localhost:8080/post/likeExternal';
        body = post;
    } else{
        if(liked){
            url = `http://localhost:8080/post/unlike/${post.id}`;
            method = 'DELETE'
        } else{
            url = 'http://localhost:8080/post/like';
            body = {postId: post.id};
        }
    }

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ...(body && method !== "DELETE" ? { body: JSON.stringify(body) } : {})
    })
        .then((res) => res.json())
        .then(savedPost => {
                //if the data is a list
                if (data == 'multiple') {
                    setter((prev) =>
                        prev.map((p) =>
                            (isExternal ? p.tempId === post.tempId : p.id === post.id)
                                ? {
                                    ...p,
                                    id: savedPost.id,
                                    likedByCurrentUser: !liked,
                                    likeCount: liked ? p.likeCount - 1 : p.likeCount + 1,
                                }
                                : p
                        )
                    );
                    //in profile page, for setting user like history locally
                    if (likeSetter) {
                        if (!liked) {
                            const likedItem = news?.find((p: any) => isExternal ? p.tempId === post.tempId : p.id === post.id);
                            if (likedItem) {
                                likeSetter((prev: any) => [
                                    ...prev,
                                    { ...likedItem, likedByCurrentUser: true, likeCount: likedItem.likeCount + 1 },
                                ]);
                            }
                        } else {
                            likeSetter((prev: any) => prev.filter((p: any) => isExternal ? p.tempId !== post.tempId : p.id !== post.id));
                        }
                    }
                } else { //if the data is single (the news detail)
                    setter((prev) => ({
                        ...prev,
                        id: savedPost.id,
                        likedByCurrentUser: !prev.likedByCurrentUser,
                        likeCount: prev.likedByCurrentUser
                            ? prev.likeCount - 1
                            : prev.likeCount + 1,
                    }));
                }
            }
        ).catch((err) => console.error(err));
};