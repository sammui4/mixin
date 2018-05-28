var express = require('express');
var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.get('/interesting',function(req, res, next){
    console.log(req.query);
    if(req.query.name=='w'){
        res.send({"code":200,"state":{"download":true,"upload":true}})
    }else{
        res.send({"code":200,"state":{"download":false,"upload":false}})
    }
   
})
app.listen(3000)