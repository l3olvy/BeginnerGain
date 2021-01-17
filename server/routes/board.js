const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);

router.get("/getqna", (req, res)=>{
	const sqlQuery = "SELECT * FROM qboard ORDER BY idx DESC"; //내림차순 정렬
	connection.query(sqlQuery, (err, result)=>{
		res.send(result);
	})
})

router.post("/getqna_c", (req, res)=>{
    const bid = req.body.idx;
    const sqlQuery = "SELECT * FROM q_comment where bid=? ORDER BY idx DESC"; //내림차순 정렬
    connection.query(sqlQuery, [bid], (err, result)=>{
        res.send(result);
    })
})

router.post("/gettalk_c", (req, res)=>{
    const bid = req.body.idx;
    const sqlQuery = "SELECT * FROM t_comment where bid=? ORDER BY idx DESC"; //내림차순 정렬
    connection.query(sqlQuery, [bid], (err, result)=>{
        res.send(result);
    })
})

router.get("/gettalk", (req, res)=>{
	const sqlQuery = "SELECT * FROM tboard ORDER BY idx DESC"; //내림차순 정렬
	connection.query(sqlQuery, (err, result)=>{
		res.send(result);
	})
})

router.post("/deleteqna", (req, res) => {
    const idx = req.body.idx;
    const bid = req.body.idx;
    const sqlQuery = "delete from qboard where idx=?;" + "delete from q_comment where bid=?;";
    connection.query(sqlQuery, [idx, bid], (err, result) => {
        res.send('good!');
    })
});

router.post("/deletetalk", (req, res) => {
    const idx = req.body.idx;
    const bid = req.body.idx;
    const sqlQuery = "delete from tboard where idx=?;" + + "delete from t_comment where bid=?;";
    connection.query(sqlQuery, [idx, bid], (err, result) => {
        res.send('good!');
    })
});

router.post("/writing", (req, res) => {
    const writer = req.body.writer;
    const title = req.body.title;
    const contents = req.body.contents;
    const img = req.body.img;
    const tag = req.body.tag;
    const hit = req.body.hit;
    const rdate = req.body.rdate;

    const sqlQuery = "INSERT INTO qboard (writer, title, contents, img, tag, hit, rdate ) VALUES (?,?,?,?,?,?,?)";
    connection.query(sqlQuery, [writer, title, contents, img, tag, hit, rdate], (err, result)=>{
        res.send('good');
    })
});

module.exports = router;

