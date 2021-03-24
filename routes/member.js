const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session');
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();

router.use(session({secret: '!@#$IDISRNDASSETS!#$%', resave: true, saveUninitialized: false }));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
router.use(passport.initialize());
router.use(passport.session());

router.get('/session', ensureAuthenticated, function(req, res) {
    // deserializeUser에서 추가로 저장한 정보까지 전달 받음
    let userInfo = req.user;
    
    if(userInfo.id !== "" && userInfo.id !== undefined && userInfo.id !== null) {
	    res.json({
	        loggedIn : true,
	        id : userInfo.id,
	        name : userInfo.name
	    });
    } else {
    	res.send("fail");
    }
});

router.post("/join", (req, res)=> {
	const id = req.body.id;
	const pwd = req.body.pw; // 암호화 
	const name = req.body.name;
	const email = req.body.email;

	hasher({password: pwd}, (err, pass, salt, hash) => {
		connection.query(
			"INSERT INTO member (id, pw, name, email, salt) VALUES (?,?,?,?,?)",
			[id, hash, name, email, salt],
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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var userinfo;
    var sql = 'SELECT * FROM member WHERE id=?';
    connection.query(sql , [id], function (err, result) {
    	if(err) console.log('mysql 에러');     

    	var json = JSON.stringify(result[0]);
    	userinfo = JSON.parse(json);
    	done(null, userinfo);
    })    
});

passport.use(new LocalStrategy({
	usernameField: 'id',
	passwordField: 'pwd'
},
	function(username, password, done) {
		connection.query(
			"SELECT * FROM member WHERE id=?",
			username,
			(err, result) => {
				if (err) {
					res.send({ err: err });
				}

				if (result.length > 0) { // 아이디가 있으면
					hasher({password:password, salt:result[0].salt}, function(err, pass, salt, hash){
						if(hash === result[0].pw){
							var json = JSON.stringify(result[0]);
							var userinfo = JSON.parse(json);
							return done(null, userinfo);  // result값으로 받아진 회원정보를 return해줌
						} else {
							return done(null, false, { message: 'fail' });
						}
					});
				} else {
					return done(null, false, { message: 'undefined' });
				}
			}
		);
	}
));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // 현재 session이 유효한 세션인가?
        // 유효 하므로 다음으로
        return next();
    } else {
      res.send("fail");
    }    
}

router.post('/loginAf', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) { // "local"이라는 LocalStrategy를 사용하여 session 처리
        if (err) {
            next(err);
        }
        if (!user) {
            return res.redirect("/#/login"+"?check=fail");
        } else {
        	req.logIn(user, function(err) {
	            if (err) {
	                next(err);
	            }
	            res.redirect("/");
	        });
        }
        
    })(req, res, next);}
);

router.get('/logout', function (req, res) {
  req.logout();
  res.send('good');
});

module.exports = router;