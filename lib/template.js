module.exports = {
    HTML:function(name, list, body, control){
       return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../style.css">
    <title>${name}</title>
</head>
<body>
    <h1><a href="/">CRUD 커뮤니티</a></h1>
    <!-- 메뉴부분 -->
    <div class="con">
    <div class="control">
    ${control}
    </div>
    <div class="abc">

    <div class="list">
    ${list}
    </div>
    <div class="content">
    ${body}
    </div>
    </div>
    </div>
</body>
</html>`
    },
    list:function(files){
        let list = '<ol>'
        for(i=0;i<files.length;i++){
            list += `<li><a href="?name=${files[i]}">${files[i]}</a></li>`
        }
        list += '</ol>'
        return list
    },
    create:function(){
        return `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="제목"></p>
        <p><textarea name="description" placeholder="내용"></textarea></p>
        <p><button type="submit">완료</button></p>
    </form>`
    },
    update:function(name, content){
        return `<form action="/update_process" method="post">
        <p><input type="hidden" name="id" value="${name}"></p>
        <p><input type="text" name="title" placeholder="제목" value="${name}"></p>
        <p><textarea name="description" placeholder="내용">${content}</textarea></p>
        <p><button type="submit">완료</button></p>
    </form>`
    }
}
