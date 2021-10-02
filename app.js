const express = require('express')
const mongoose = require('mongoose')

const route = require('./route/routes')
const middlewire = require('./custom middlewire/middlewire')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

middlewire(app)
route(app)

app.use((req,res,next)=> {
    let err = new Error (`404 Page Not Found`)
    err.status = 404
    next(err)
})

app.use((err,req,res,next) => {
    if (err.status === 404) {
        return res.render('pages/error/404err', {title: "404 Not Found",flashMessage : {}})
    }else{
         return res.render('pages/error/500err', {title: "Internal Error",flashMessage : {}})
     }
})

const PORT = process.env.PORT || 80
mongoose.connect(`mongodb://localhost/${process.env.DB_COLLECTION}`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, ()=> {
        console.log(`Server running at post ${PORT}`);
    })).catch(e => console.log(e))