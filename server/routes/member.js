const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);
const session = require("express-session");
const bcrypt = require("bcrypt-nodejs");

router.use(session({
	secret: 'bgSession',
	resave: true,
	saveUninitialized: true
}));

router.get("/", function(req, res, next) {
	// 다중 쿼리 작성
	// const sqlQuery = 'SELECT * FROM member;' + "SELECT * FROM qboard;";
	// connection.query(sqlQuery, function(err, rows, fields) {
	// 	res.send(rows[0]);
	// })
});

router.post('/login', function(req, res, next) {
	const id = req.body.id;
	const pw = req.body.pw;
	const sqlQuery = "SELECT * FROM member WHERE id=?";

	connection.query(sqlQuery, id, function(err, rows, fields) {
		if(err){
			console.log(err);
			res.status(500).send("ERROR");
		} else {
			if(rows[0] != undefined) {
				if(!bcrypt.compareSync(pw, rows[0].pw)) {
					res.send("fail");
				} else {
					res.send("success");
					req.session.user = id;
					console.log("test",req.session.user);
				}
			} else {
				res.send("undefined");
			}
		}
	})
});

router.post('/join', function(req, res, next) {
	const id = req.body.id;
	const pw = req.body.pw;
	const name = req.body.name;
	const email = req.body.email;

	bcrypt.hash(pw, null, null, function(err, hash) {
		const sqlQuery = "INSERT INTO member (id, pw, name, email) VALUES (?,?,?,?)";
		// 회원가입 비밀번호 암호화
		connection.query(sqlQuery, [id, hash, name, email], (err, result) => {
			if(err){
				console.log(err);
				res.status(500).send("ERROR");
			}
			res.send("good");
		});
	})
	
});

module.exports = router;


