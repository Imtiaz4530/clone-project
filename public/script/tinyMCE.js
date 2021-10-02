window.onload = ()=> {
    tinymce.init({
        selector : 'textarea#tiny-mce-post-body',
        plugins: ["allychecker advlist lists link autolink autosave code",
            'preview','searchreplace','wordcount','media table emoticons image imagetools'],
        toolbar: 'undo redo | bold italic underline| alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image media | code preview | ' +
            'forecolor backcolor emoticons ',
        block_unsupported_drop: false,
        height: 300,
        automatic_uploads : true,
        relative_urls:false,
        images_upload_url: '/upload/postImage',
        images_upload_handler : (blobinfo, success, failure)=> {
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let formData = new FormData()
            formData.append('post-image', blobinfo.blob(), blobinfo.filename())

            let req = new Request('/upload/postImage',{
                method : 'POST',headers,mode: 'cors',body: formData})
            fetch(req).then(res => res.json)
                      .then(data => {
                          success(data.imgUrl)
                      }).catch(()=> failure('HTTP Error')) 
        }})}
