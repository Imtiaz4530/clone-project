window.onload = function () {
    let baseCrooping = $('#cropped-image').croppie({
        viewport : {
            width:500,
            height: 500
        },
        boundary : {
            width:600,
            height:700
        },
        showZoomer : true
    })
    function readableFile(file) {
        let reader = new FileReader()
        reader.onload = e=>{
            baseCrooping.croppie('bind', {
                url : e.target.result
            }).then(()=> {
                $('.cr-slider').attr({
                    'min':0.5500,
                    'max':1.5000
                })
            })
        }
        reader.readAsDataURL(file)
    }
    const cropModal = document.getElementById('crop-modal')
    const myModal = new bootstrap.Modal(cropModal)
    $('#profilePicsFile').on('change', function(e) {
        if (this.files[0]) {
            readableFile(this.files[0])
            new bootstrap.Modal(cropModal,{
                backdrop:'static',
                keyboard: false
            })
            myModal.show()
        }
    })
    $('#cencel-crooping').on('click', function() {
        myModal.hide()
    })
    $('#upload-image').on('click', e => {
        baseCrooping.croppie('result','blob').then(blob => {
            let formData = new FormData()
            let file = document.getElementById('profilePicsFile').files[0]
            let name = generateFileName(file.name)
            formData.append('profilePics', blob , name)

            let header = new Headers()
            header.append('Accept', 'Application')

            let req = new Request('/upload/propic', {
                method : 'POST',header,mode: 'cors',body: formData})
            return fetch(req)
        }).then(res => res.json()).then(data => {
            document.getElementById("removeProfilePics").style.display = 'block'
            document.getElementById("profilePics").src = data.profilePics
            document.getElementById("profilePicform").reset()
            myModal.hide()
        }).catch(e => console.log(e))
    })
    $('#removeProfilePics').on('click', function() {
        let req = new Request('/upload/propic', {
            method : 'DELETE',
            mode: 'cors',
        })
        fetch(req).then(res => res.json())
                  .then(data => {
                    document.getElementById("removeProfilePics").style.display = 'none'
                    document.getElementById("profilePics").src = data.profilePics
                    document.getElementById("profilePicform").reset()
                }).catch(e => {console.log(e), alert(`Server Error`)})
    })
}

function generateFileName(name) {
    const types = /(.jpeg|.jpg|.png|.gif)/
    return name.replace(types , '.png')
}
