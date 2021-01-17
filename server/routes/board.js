const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);

router.get("/getqna", (req, res)=>{
	console.log("test");
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

router.post("/deleteqna", (req, res) => {
    const idx = req.body.idx;
    const sqlQuery = "delete from qboard where idx=?";
    connection.query(sqlQuery, [idx], (err, result) => {
        res.send('good!');
    })
});

router.post("/deletetalk", (req, res) => {
    const idx = req.body.idx;
    const sqlQuery = "delete from tboard where idx=?";
    connection.query(sqlQuery, [idx], (err, result) => {
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

