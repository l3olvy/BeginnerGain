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
const cookieParser = require('cookie-parser');
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const serveStatic = require("serve-static");

const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir:"./images"});
const morgan = require('morgan');


const path = require('path');
const fs = require('fs');
const { error } = require('console');

const nodemailer = require('nodemailer');

app.use(express.json());
app.use(
   cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
   })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

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

app.use(
   session({
      key: "userId",
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
      cookie: {
         expires: 60 * 60 * 24
      }
   })
);


/* 라우팅 */
const board = require("./routes/board");
app.use("/board", board);

app.use(express.static(path.join(__dirname, './client/build')));

app.get("/", function(req, res, next) {
   res.send(express.static(path.join(__dirname, './client/build/index.html')));
})

app.post("/join", (req, res) => {
   const id = req.body.id;
   const pw = req.body.pw;
   const name = req.body.name;
   const email = req.body.email;

   bcrypt.hash(pw, saltRounds, (err, hash) => {
      if (err) {
         console.log(err);
      }

      connection.query(
         "INSERT INTO member (id, pw, name, email) VALUES (?,?,?,?)",
         [id, hash, name, email],
         (err, result) => {
            if(err){
               console.log(err);
               res.status(500).send("ERROR");
            }
            res.send("good");
         }
      );
   });
});

app.get("/qna", (req, res) => {
   if (req.session.user) {
      res.send(req.session.user);
      console.log(req.session.user);
   } else {
      res.send(req.session.user);
      console.log("test");
   }
});

app.get("/login", (req, res) => {
   if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user});
   } else {
      res.send({ loggedIn: false });
   }
});

app.post("/login", (req, res) => {
   const username = req.body.id;
   const password = req.body.pw;

   connection.query(
      "SELECT * FROM member WHERE id=?",
      username,
      (err, result) => {
         if (err) {
            res.send({ err: err });
         }

         if (result.length > 0) {
            bcrypt.compare(password, result[0].pw, (error, response) => {
               if (response) {
                  req.session.user = result;
                  res.send("success");
               } else {
                  res.send("fail");
               }
            });
         } else {
            res.send("undefined");
         }
      }
   );
});

app.post("/idCheck", (req, res) => {
   const id = req.body.id;

   connection.query(
      "SELECT * FROM member WHERE id=?",
      id,
      (err, result) => {
         if (err) {
            res.send({ err: err });
         }

         if(result.length > 0) {
            res.send("exist");
         } else {
            res.send("good");
         }
      }
   );
});


///이메일 연동
app.post('/checkidemail',(req, res) =>{
   const name = req.body.name;
   const email = req.body.email;

   connection.query("SELECT * FROM member WHERE name=?;"+"SELECT name FROM member WHERE email=?;",[name, email], (err, result) => {
      if (err) {
         res.send({ err: err });
      }
      if(result[0].length > 0) { //이름있음
         //console.log(result[1][0].name);
         if(result[1][0].name == name)   //이메일 - 이름 확인
            res.send("exist");      
         else
            res.send("noemail");      
      } else {                
         res.send("noname"); //이름없음
      }
   });
});


app.post('/checkpwemail',(req, res) =>{
   const name = req.body.name;
   const id = req.body.id;   
   const email = req.body.email;

   connection.query("SELECT * FROM member WHERE name=? and id=?;"+"SELECT name FROM member WHERE email=? and id=?;",[name, id, email, id], (err, result) => {
      if (err) {
         res.send({ err: err });
      }
      if(result[0].length > 0) { //이름-id있음
         //console.log(result[1][0].name);
         if(result[1][0].name == name)   //이메일-id - 이름 확인
            res.send("exist");      
         else
            res.send("noemail");      
      } else {                
         res.send("noname"); //이름id없음
      }
   });
});

app.post('/sendID', async(req, res) => {
   const name = req.body.name;
   const email = req.body.email;

   connection.query( "SELECT id FROM member WHERE name=? and email=?",[name,email], async(err, result) => {
      if (err) {
         res.send({ err: err });
      }
      else {
         let id = result[0].id;
         const smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
               user: "beginnergainofficial@gmail.com",
               pass: "qhstnrh!"
            },
            tls: {
               rejectUnauthorized: false
            }
         });

         const mailOptions = {
         from: "beginnergainofficial@gmail.com",
         to: email,
         subject: "Beginnergain-아이디 찾기",
         text: name+"님의 아이디는 "+id+" 입니다."
         };

         await smtpTransport.sendMail(mailOptions, (error, responses) =>{
            if(error){
                res.send({ err: err });
            }else{
                res.send("good");
            }
            smtpTransport.close();
         });
      }
   });
});

app.post('/changePW', async(req, res) => {
   const name = req.body.name;
   const email = req.body.email;
   const checknum = req.body.checknum;

   const smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
         user: "beginnergainofficial@gmail.com",
         pass: "qhstnrh!"
      },
      tls: {
         rejectUnauthorized: false
      }
   });

   const mailOptions = {
      from: "beginnergainofficial@gmail.com",
      to: email,
      subject: "Beginnergain-비밀번호 변경 인증 찾기",
      text: "인증번호는 "+checknum+" 입니다."
   };

   await smtpTransport.sendMail(mailOptions, (error, responses) =>{
      if(error){
          res.send({ err: err });
      }else{
          res.send("good");
      }
      smtpTransport.close();
   });
});




app.get("/logout", (req,res) => {
   delete req.session.user;
   req.session.save();
   res.send("good");
});

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
      // console.log('client가 보낸 데이터: ', data);
      io.emit('upload', {name:data.name, message:data.message});
      /*io.emit('upload', data);*/
   });

   socket.on('code_send', (data) => {
      // console.log('client가 보낸 데이터: ', data);
      io.emit('uploads', {name:data.name, code: data.code, lang : data.lang, message:data.message});
      /*io.emit('upload', data);*/
   });

   socket.on('disconnect', function () {
      console.log('user disconnected: ', socket.id);
   });
});

server.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });

module.exports = app;