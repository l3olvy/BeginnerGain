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
		credentials: true,
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
			expires: 60 * 60 * 24,
		},
	})
	);
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
		"SELECT * FROM member WHERE id = ?;",
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


app.get("/logout", (req,res) => {
	delete req.session.user;
	req.session.save();
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
	// console.log(req.files);
})

app.listen(PORT, ()=>{
	console.log(`running on port ${PORT}`);
});

module.exports = app;