window.onload = () => {
    let basecropping = $('#cropped-image').croppie({
        viewport: { width: 150, height: 200 },
        boundary: { width: 300, height: 300 },
        showZoomer: false
    })
    function readFile(file) {
        let reader = new FileReader()
        reader.onload = e => {
            basecropping.croppie('bind',{
                url : e.target.result
            }).then(() => {
                $('.cr-slider').attr({
                    'min': 0.5000,
                    'max':1.5000
                })
            })
        }
        reader.readAsDataURL(file)
    }
    let cropModal = document.getElementById('crop-modal')
    let myModal = new bootstrap.Modal(cropModal)
    $('#profilePicsFile').on('change', function (e) {
        if (this.files[0]) {
            readFile(this.files[0])
            new bootstrap.Modal(cropModal, {
                backdrop: 'static',
                keyboard: false
            })
            myModal.show()
        }
    })
    $('#cencel-crooping').on('click', function (e) { myModal.hide() })

    $('#upload-image').on('click', function (e) {
        basecropping.croppie('result', 'blob').then((blob)=> {
            let formdata = new FormData()
            let file = document.getElementById('profilePicsFile').files[0]
            let name = generateFileName(file.name)
            formdata.append('profilePics', blob, name)

            let header = new Headers()
            header.append('Accept', 'Application/JSON')

            let req = new Request('/upload/propic', {
                method : 'POST', header, mode: 'cors', body:'formdata'
            })
            return fetch(req)
        }).then((res)=> {res.json()}).then((data)=> {
            document.getElementById('removeProfilePics').style.display = 'block'
            document.getElementById('profilePics').src = data.profilePics
            document.getElementById('profilePicform').reset()
        }).catch(e => console.log(e))
    })
    $('#removeProfilePics').on('click', function(e) {
        let req = new Request('/upload/propic', {
            method:'DELETE',mode: 'cors'
        })
        return fetch(req).then((res)=> {res.json()}).then((data)=> {
            document.getElementById('removeProfilePics').style.display = 'none'
            document.getElementById('profilePics').src = data.profilePics
            document.getElementById('profilePicform').reset()
        }).catch(e => {console.log(e), alert(`Server Error`)})
    })
}

function generateFileName(name) {
    const types = /(.jpeg|.jpg|.png|.gif)/
    return name.replace(types , '.png')
}