let likeButton = document.getElementById("likeButton")
let dislikeButton = document.getElementById("dislikeButton")

function reqLikeDislike(type, postId){
    let header = new Headers()
    header.append('Accept', 'Application/JSON')
    header.append('Content-Type', 'Application/JSON')

    let req = new Request(`/api/${type}/${postId}`, {
        method:'GET', header, mode:'cors'
    })

    return fetch(req)
}

dislikeButton.addEventListener('click', e => {
    let postId = dislikeButton.dataset.post

    reqLikeDislike('dislike', postId).then(res => res.json())
                                .then(data => {
                                    let disliketext = data.disliked ?'Disliked':'Dislike'
                                    dislikeButton.innerHTML = disliketext +`(${data.totalDislikes})`
                                    likeButton.innerHTML = `Like(${data.totalLike})`
                                })
})

likeButton.addEventListener('click', e => {
    let postId = likeButton.dataset.post

    reqLikeDislike('like', postId).then(res => res.json())
                                .then(data => {
                                    let liketext = data.liked ?'Liked':'Like'
                                    likeButton.innerHTML = liketext +`(${data.totalLike})`
                                    dislikeButton.innerHTML = `Dislike(${data.totalDislikes})`
                                })
})