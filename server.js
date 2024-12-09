import express, { request, response } from 'express'
/* const = a uma variavel*/
/* express = e passado como uma função*/
const app = express ()
app.use (express.json ())

const user = []

app.post ('/usuarios',(req, res) => {
        user.push(req.body)

        res.send('ok aqui deu certo')
    })

app.get ('/usuarios',(req, res) => {

res.json(user)

}) 

app.listen(3000)