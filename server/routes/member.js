const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);
const session = require("express-session");
//const cookieParser = require("cookie-parser");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//router.use(cookieParser('keyboard cat'));
router.use(session({secret: 'keyboard cat'}));
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log(id);
	
	const sql = "SELECT * FROM member WHERE id=?";
	connection.query(sql, [id], function(err, result) {
		if(err) console.log('mysql 에러');
		//console.log("result" ,result);
		const json = JSON.stringify(result[0]);
		const userinfo = JSON.parse(json);
		done(null,userinfo);
	})
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', {
		successRedirect: "/",
		failureRedirect: "/",
		failureFlash : true
	})
	
	res.send("Tests");
});

passport.use(new LocalStrategy(
	{
		usernameField: "username",
		passwordField : "password"
	},
	function(username, password, done) {
		const sqlQuery = "SELECT * FROM member WHERE id=? and pw=?";
		connection.query(sqlQuery, [username, password], function (err, result) {
			if(err) console.log("mysql 에러");

			if(result.length == 0) {
				console.log("결과 없음");
				return done(null, false, { message: "Incorrect"});
			} else {
				console.log(result);
				const json = JSON.stringify(result[0]);
				const userinfo = JSON.parse(json);
				console.log("userinfo" + userinfo);
				return done(null, userinfo);
			}
		});
	}
));

router.post('/join', function(req, res, next) {
	const id = req.body.id;
	const pw = req.body.pw;
	const name = req.body.name;
	const email = req.body.email;

	const sqlQuery = "INSERT INTO member (id, pw, name, email) VALUES (?,?,?,?)";
	// 회원가입 비밀번호 암호화
	connection.query(sqlQuery, [id, pw, name, email], (err, result) => {
		res.send("good");
	})
	
});

module.exports = router;