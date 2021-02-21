const express = require('express');
const mysql = require('mysql');
const dbconfig = require('./database.js');
const connection = mysql.createConnection(dbconfig);

const cors = require('cors');
const PORT = process.env.port || 8000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

const serveStatic = require("serve-static");

const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir:"./images"});
const morgan = require('morgan');

app.set('port', PORT);

const path = require('path');
const fs = require('fs');
const { error } = require('console');

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


app.listen(PORT, ()=>{
	console.log(`running on port ${PORT}`);
});


//chatting
/*
app.get('/chat',function(req, res){
  res.sendFile(__dirname + '/client.html');
}); 

const http = require('http').Server(app);
const io = require('socket.io')(http);


var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

*/


module.exports = app;
