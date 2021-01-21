const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);

/*board list 가져오기*/
router.get("/getqna", (req, res)=>{
	const sqlQuery = "SELECT * FROM qboard ORDER BY idx DESC"; //내림차순 정렬
	connection.query(sqlQuery, (err, result)=>{
		res.send(result);
	})
})

router.get("/gettalk", (req, res)=>{
	const sqlQuery = "SELECT * FROM tboard ORDER BY idx DESC"; //내림차순 정렬
	connection.query(sqlQuery, (err, result)=>{
		res.send(result);
	})
})

/*comment 가져오기*/
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

/*post 삭제 - comment도 같이 삭제됨*/
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
    const sqlQuery = "delete from tboard where idx=?;" + "delete from t_comment where bid=?;";
    connection.query(sqlQuery, [idx, bid], (err, result) => {
        res.send('good!');
    })
});

/*comment 삭제*/
router.post("/deleteqna_c", (req, res) => {
    const idx = req.body.idx;
    const sqlQuery = "delete from q_comment where idx=?";
    connection.query(sqlQuery, [idx], (err, result) => {
        res.send('good!');
    })
});

router.post("/deletetalk_c", (req, res) => {
    const idx = req.body.idx;
    const sqlQuery = "delete from t_comment where idx=?";
    connection.query(sqlQuery, [idx], (err, result) => {
        res.send('good!');
    })
});

/*board-writing*/
router.post("/writing_qna", (req, res) => {
    const writer = req.body.writer;
    const title = req.body.title;
    const contents = req.body.contents;
    const img = req.body.img;
    const tag = req.body.tag;
    const hit = req.body.hit;
    const rdate = req.body.rdate;

    const sqlQuery = "INSERT INTO qboard (writer, title, contents, img, tag, hit, rdate ) VALUES (?,?,?,?,?,?,NOW())";
    connection.query(sqlQuery, [writer, title, contents, img, tag, hit], (err, result)=>{
        res.send('good');
    })
});

router.post("/writing_talk", (req, res) => {
    const writer = req.body.writer;
    const title = req.body.title;
    const contents = req.body.contents;
    const img = req.body.img;
    const category = req.body.category;
    const hit = req.body.hit;
    const rdate = req.body.rdate;

    const sqlQuery = "INSERT INTO tboard (writer, title, contents, img, category, hit, rdate ) VALUES (?,?,?,?,?,?,NOW())";
    connection.query(sqlQuery, [writer, title, contents, img, category, hit], (err, result)=>{
        res.send('good');
    })
});

/*update post*/
router.post("/updateqna", (req, res) => {
    const idx = req.body.idx;
    const title = req.body.title;
    const contents = req.body.contents;
    const tag = req.body.tag;

    const sqlQuery = "UPDATE qboard SET title=?, contents=?, tag=? WHERE idx=?";
    connection.query(sqlQuery, [title, contents, tag, idx], (err, result)=>{
        res.send('good');
    })
});

router.post("/updatetalk", (req, res) => {
    const idx = req.body.idx;
    const title = req.body.title;
    const contents = req.body.contents;
    const category = req.body.tag;

    const sqlQuery = "UPDATE tboard SET title=?, contents=?, category=? WHERE idx=?";
    connection.query(sqlQuery, [title, contents, category, idx], (err, result)=>{
        res.send('good');
    })
});

/*update comment*/
router.post("/updateqna_c", (req, res) => {
    const idx = req.body.idx;
    const contents = req.body.contents;

    const sqlQuery = "UPDATE q_comment SET contents=? WHERE idx=?";
    connection.query(sqlQuery, [contents, idx], (err, result)=>{
        res.send('good');
    })
});

router.post("/updatetalk_c", (req, res) => {
    const idx = req.body.idx;
    const contents = req.body.contents;

    const sqlQuery = "UPDATE t_comment SET contents=? WHERE idx=?";
    connection.query(sqlQuery, [contents, idx], (err, result)=>{
        res.send('good');
    })
});

module.exports = router;

