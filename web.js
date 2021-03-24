const express = require('express');
const mysql = require('mysql');
const dbconfig = require('./database.js');
const connection = mysql.createConnection(dbconfig);

const cors = require('cors');
const PORT = process.env.port || 8000;

const app = express();
app.set('port', PORT);

const server = require('http').Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');

const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir:"./images"});
const morgan = require('morgan');

const path = require('path');
const fs = require('fs');
const { error } = require('console');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

/* 라우팅 */
const board = require("./routes/board");
app.use("/board", board);

const member = require("./routes/member");
app.use("/member", member);

app.use(express.static(path.join(__dirname, './client/build')));

app.get("/", function(req, res, next) {
   res.send(express.static(path.join(__dirname, './client/build/index.html')));
})

/*과거 뉴스*/
const spawn = require("child_process").spawn;

app.post('/getNews', (req, res) => {
	//var dataToSend = [];
	const start = req.body.start;
	const end = req.body.end;
	console.log("시작", start)
	const python = spawn('python', ['keyword.py', start, end]);
	let news = '';
	python.stdout.on('data', (data) => { 
		//myjson.push(JSON.parse(data));
		news += data;
	})

	python.on('close', (code) => {
		res.send(JSON.parse(news));
	})
   python.stderr.pipe(process.stderr);
})

/* 최신뉴스//////////////// */
app.post('/getbrandNews', (req, res) => {
   console.log("최신뉴스");
   const python = spawn('python', ['brandnew.py']);
   let news = '';

   python.stdout.on('data', (data) => {
      news += data;
   })

   python.on('close', (code) => {
      res.send(JSON.parse(news));
   })
   python.stderr.pipe(process.stderr);
})

/*뉴스 요약2*/
app.post('/getSum', (req, res) => {
   const paragraph = req.body.paragraph;
   console.log("문장",paragraph);
   let sum;
   const python = spawn('python', ['sum.py', paragraph]);

   python.stdout.on('data', (data) => {
      sum = JSON.parse(data.toString());
      console.log("sum", sum);
      //console.log(dataToSend)
   })
   python.on('close', (code) => {
      res.send(sum);
   })
})

app.use(express.static("uploads"));
app.post('/upload', MultipartyMiddleware, (req, res)=>{
   var TempFile = req.files.upload;
   var TempPathFile = TempFile.path;

   const targetPathUrl = path.join(__dirname,"./uploads/"+TempFile.name);
   
   if(path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg"){
      fs.rename(TempPathFile, targetPathUrl, err =>{
         res.status(200).json({
            uploaded: true,
            url: `${TempFile.originalFilename}`
         });
         if(err) return console.log(err);
      })
   }
});

io.on('connection', (socket) => { // 기본 연결
   socket.on('newUser', (data) => { // on 데이터를 받을때
      io.emit('enter', data); // emit 데이터를 보낼때
   });

   socket.on('message', (data) => {
      io.emit('upload', {name:data.name, message:data.message});
   });

   socket.on('code_send', (data) => {
      io.emit('uploads', {name:data.name, code: data.code, lang : data.lang, message:data.message});
   });

   socket.on('disconnect', function () {
      console.log('user disconnected: ', socket.id);
   });
});

server.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });

module.exports = app;