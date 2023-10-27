const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000


const template = require('./lib/template.js')
//리팩토링으로 따로 뺀 html
app.use(express.static('./'))
app.get('/', (req,res)=>{
    // const q = req.query
    // const name = q.name
    // console.log(name)
    let {name} = req.query
    fs.readdir('page', (err, files)=>{
        if (err) {
            console.log('Error reading directory:', err);
            return;
        }
        let list = template.list(files)
        fs.readFile(`page/${name}`, 'utf-8', (err,data)=>{
            let control = `<a href="/create">생성</a> <a href="/update?name=${name}">수정</a>
            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${name}">
                <button type="submit">삭제</button>
            </form>
            `
            if(name === undefined){
                name = '환영합니다'
                data = '생성을 눌러 글을 작성할 수 있습니다.'
                control = '<a href="/create">생성</a>'
            }
            const html = template.HTML(name, list, `<h2>${name}</h2> <p>${data}</p>`, control)
        res.send(html)
        })
    })   
})

const qs = require('querystring')
app.post('/create_process', (req,res)=>{
    // res.send('성공')
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const title = post.title
        const description = post.description
        fs.writeFile(`page/${title}`, description, 'utf8', (err)=>{
            res.redirect(302, `/?name=${title}`) //처리 후 다른 페이지 이동
        })
    })
})

app.get('/create', (req,res)=>{
    fs.readdir('page', (err,files) =>{
        const name = 'create'
        const list = template.list(files)
        const data = template.create()
        const html = template.HTML(name, list, data, '')
        res.send(html)
    })
})

app.get('/update', (req,res)=>{
    let {name} = req.query
    fs.readdir('page', (err, files)=>{
        let list = template.list(files)
        fs.readFile(`page/${name}`, 'utf-8', (err,content)=>{
            let control = `<a href="/create">생성</a> <a href="/update?name=${name}">수정</a>`
            const data = template.update(name, content)
            const html = template.HTML(name, list, `<h2>${name}</h2> <p>${data}</p>`, control)
        res.send(html)
        })
    })   
})

app.post('/update_process', (req,res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const id = post.id
        const title = post.title
        const description = post.description
        fs.rename(`page/${id}`,`page/${title}`,(err)=>{ //파일명을 덮어쓰기
            fs.writeFile(`page/${title}`, description, 'utf8', (err)=>{
                res.redirect(302, `/?name=${title}`) //처리 후 다른 페이지 이동
            })
        })
    })
})

app.post('/delete_process', (req,res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const id = post.id
        fs.unlink(`page/${id}`,(err)=>{
            res.redirect(302,`/`)
        })
    })
})

app.listen(port, ()=>{
    console.log(`server is running on ${port} port\nhttp://127.0.0.1:${port}`)
})