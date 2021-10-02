let bookmarks = document.getElementsByClassName('bookmark');
[...bookmarks].forEach(bookmark => {
    bookmark.style.cursor = 'pointer'
    bookmark.addEventListener('click', e => {
        let target = e.target.parentElement

        let header = new Headers()
        header.append('Accept', 'Application/JSON')

        let req = new Request(`/api/bookmark/${target.dataset.post}`,{method:'GET',header, mode:'cors'})
        fetch(req).then(res => res.json)
        .then(date => {
            if (date.bookmark) {
                target.innerHTML = `<i class="fas fa-bookmark"></i>`
            } else {
                target.innerHTML =`<i class="far fa-bookmark"></i>`
            }
        }).catch(e => {
            console.log(e.response.date.error);
            alert(e.response.date.error)
        })
    })
});


