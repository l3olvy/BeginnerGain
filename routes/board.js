const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('../database.js');
const connection = mysql.createConnection(dbconfig);
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

router.get("/getBoard/:currentPage/:category", (req, res)=> {
	let listCount = 5;
	let btnCount = 5;
	let nowPage = 1;
	let totalRow = 0;
	let boardName;
	let kind;

	if(req.params.currentPage) {
		nowPage = parseInt(req.params.currentPage);
	}

	if(req.params.category) {
		if(req.params.category == "qna") {boardName = "qboard"; kind = "tag";}
		else {boardName = "tboard"; kind = "category";}
	}

	let startPage = (nowPage-1) * listCount;
	let model = {};

	let lastPage = 0;

	// 글의 총 개수를 구하는 쿼리
	let sql = "SELECT COUNT(*) As cnt From "+boardName;
	connection.query(sql, (err, result) => {
		if(err) {
			console.log(err);
			res.end();
		} else {
			totalRow = result[0].cnt; // 총 글의 개수
			lastPage = Math.ceil(parseInt(totalRow) / parseInt(listCount)); // 마지막 페이지
		}
	});

	let sqls = "SELECT * FROM "+boardName+" LEFT JOIN "+kind+" ON "+boardName+".idx="+kind+".idx ORDER BY "+boardName+".idx DESC LIMIT ?,?";
	connection.query(sqls, [startPage, listCount], (err, rs) => { 
		if(err) {
			console.log(err);
			res.end();
		} else {
			let btnBlock = Math.ceil(nowPage / btnCount);
			let minBtn = ((btnBlock - 1) * btnCount) + 1;
			model.minBtn =  minBtn;
            model.maxBtn = minBtn + btnCount;
            model.boardList = rs;
            model.currentPage = nowPage;
            model.lastPage = lastPage;
            model.total = totalRow;
            res.send({model: model});
		}
	});
})

router.post("/getPost", (req, res) => {
	const idx = req.body.idx;
	const name = req.body.name;
	
	let sqlQuery;
	if(name === "talk") sqlQuery = "SELECT * FROM tboard WHERE idx=?";
	else if(name === "qna") sqlQuery = "SELECT * FROM qboard WHERE idx=?";
	
	connection.query(sqlQuery, [idx], (err, result) => {
		res.send(result);
	});
});

/*post comment total*/
router.post("/get_total", (req, res)=>{
	const bid = req.body.idx;
	const name = req.body.name;
	let boardName;

	if(name) {
		if(name === "qna") boardName = "q_comment";
		else boardName = "t_comment";
	}

    const sqlQuery = "SELECT count(*) as Total FROM "+boardName+" where bid=?";
    connection.query(sqlQuery, [bid], (err, result)=>{
    	res.send(result);
    })
});

/*comment 가져오기*/
router.post("/get_c", (req, res)=>{
	const bid = req.body.idx;
	const name = req.body.name;
	let boardName;

	if(name === "qna") boardName = "q_comment";
	else boardName = "t_comment";
	
    const sqlQuery = "SELECT * FROM "+boardName+" where bid=? ORDER BY idx DESC"; //내림차순 정렬
    connection.query(sqlQuery, [bid], (err, result)=>{
    	res.send(result);
    })
});

/*post 삭제 - comment도 같이 삭제됨 +qboard tag도 같이 삭제*/
router.post("/deletepost", (req, res) => {
	const idx = req.body.idx;
	const bid = req.body.idx;
	const name = req.body.name;
	let boardName;
	let boardName2;
	let boardName3;

	if(name === "qna") {boardName = "qboard"; boardName2 = "q_comment"; boardName3 = "tag"; }
	else {boardName = "tboard"; boardName2 = "t_comment"; boardName3 = "category"; }

	const sqlQuery = "delete from "+boardName+" where idx=?;" + "delete from "+boardName2+" where bid=?;" + "delete from "+boardName3+" where idx=?;";
	connection.query(sqlQuery, [idx, bid, idx], (err, result) => {
		res.send('good!');
	})
});

/*comment 삭제*/
router.post("/delete_c", (req, res) => {
	const idx = req.body.idx;
	const name = req.body.name;
	let boardName;

	if(name === "qna") boardName = "q_comment";
	else boardName = "t_comment";

	const sqlQuery = "delete from "+boardName+" where idx=?";
	connection.query(sqlQuery, [idx], (err, result) => {
		res.send('good!');
	})
});

/*comment 삭제 commentN-1*/
router.post("/delete_cN", (req, res) => {
	const commentN = req.body.commentN;
	const idx = req.body.idx;
	const name = req.body.name;
	let boardName;

	if(name === "qna") boardName = "qboard";
	else boardName = "tboard";

	const sqlQuery = "UPDATE "+boardName+" SET commentN=? WHERE idx=?";
	connection.query(sqlQuery, [commentN, idx], (err, result) => {
		res.send('good!');
	})
});


/*board-writing tag추가*/
router.post("/writing_qna", (req, res) => {
	const writer = req.body.writer;
	const title = req.body.title;
	const contents = req.body.contents;
	const tag = req.body.tag;
	const hit = req.body.hit;

	const sqlQuery = "INSERT INTO qboard (writer, title, contents, tag, hit, rdate ) VALUES (?,?,?,?,?,NOW())";
	connection.query(sqlQuery, [writer, title, contents, tag, hit], (err, result)=>{
		res.send('good');
	})
});

router.post("/writing_tag", (req, res) => {   
   const tag1 = req.body.tag1;
   const tag2 = req.body.tag2;
   const tag3 = req.body.tag3;
   const sqlQuery = "INSERT INTO tag (idx, tag1, tag2, tag3) VALUES (LAST_INSERT_ID(),?,?,?)";
   connection.query(sqlQuery, [tag1, tag2, tag3], (err, result) => {
      res.send('good!');
   })
});


router.post("/writing_talk", (req, res) => {
	const writer = req.body.writer;
	const title = req.body.title;
	const contents = req.body.contents;
	const category = req.body.category;
	const hit = req.body.hit;

	const sqlQuery = "INSERT INTO tboard (writer, title, contents, category, hit, rdate ) VALUES (?,?,?,?,?,NOW())";
	connection.query(sqlQuery, [writer, title, contents, category, hit], (err, result)=>{
		res.send('good');
	})
});

router.post("/writing_category", (req, res) => {   
   const category1 = req.body.category1;
   const category2 = req.body.category2;
   const category3 = req.body.category3;
   const sqlQuery = "INSERT INTO category (idx, category1, category2, category3) VALUES (LAST_INSERT_ID(),?,?,?)";
   connection.query(sqlQuery, [category1, category2, category3], (err, result) => {
      res.send('good!');
   })
});

/*update post + tag - writing.js에 있음 */ 
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

router.post("/update_tag", (req, res) => {   
	const idx = req.body.idx;
	const tag1 = req.body.tag1;
	const tag2 = req.body.tag2;
	const tag3 = req.body.tag3;
	const sqlQuery = "UPDATE tag SET tag1=?, tag2=?, tag3=? WHERE idx=?";
		connection.query(sqlQuery, [tag1, tag2, tag3, idx], (err, result) => {
	res.send('good!');
	})
});

router.post("/update_category", (req, res) => {   
	const idx = req.body.idx;
	const category1 = req.body.category1;
	const category2 = req.body.category2;
	const category3 = req.body.category3;
	const sqlQuery = "UPDATE category SET category1=?, category2=?, category3=? WHERE idx=?";
		connection.query(sqlQuery, [category1, category2, category3, idx], (err, result) => {
	res.send('good!');
	})
});

/*update comment*/
router.post("/update_c", (req, res) => {
	const idx = req.body.idx;
	const contents = req.body.contents;
	const name = req.body.name;
	let boardName;

	if(name === "qna") boardName = "q_comment";
	else boardName = "t_comment";

	const sqlQuery = "UPDATE "+boardName+" SET contents=? WHERE idx=?";
	connection.query(sqlQuery, [contents, idx], (err, result)=>{
		res.send('good');
	})
});

/*comment insert / commentN+1*/
router.post("/postqna", (req, res) => {
	const name = req.body.name;
	const bid = req.body.bid;
	const writer = req.body.writer;
	const contents = req.body.contents;
	const idx = req.body.bid;
	const commentN = req.body.commentN;	
	let boardName;
	let boardName2;

	if(name === "qna") {boardName = "qboard"; boardName2 = "q_comment";}
	else {boardName = "tboard"; boardName2 = "t_comment";}

	const sqlQuery = "UPDATE "+boardName+" SET commentN=? WHERE idx=?;"+"INSERT INTO "+boardName2+" (bid, writer, contents, cdate) VALUES (?,?,?,NOW());";
	connection.query(sqlQuery, [commentN, idx, bid, writer, contents], (err, result)=>{
		res.send('good');
	})
});

/*general search*/
router.post("/searchqna", (req, res)=>{
	const value = req.body.value;
	if(req.body.kind === "general"){
		const sqlQuery = "SELECT * FROM qboard LEFT JOIN tag ON qboard.idx=tag.idx WHERE qboard.title LIKE ? OR qboard.contents LIKE ? ORDER BY qboard.idx DESC"; //내림차순 정렬
		connection.query(sqlQuery, ['%' + value + '%', '%' + value + '%'], (err, result)=>{
			res.send(result);
		})
	}else if(req.body.kind === "tag"){
		const sqlQuery = "SELECT * FROM qboard LEFT JOIN tag ON qboard.idx=tag.idx WHERE qboard.tag LIKE ? ORDER BY qboard.idx DESC"; //내림차순 정렬
		connection.query(sqlQuery, ['%' + value + '%'], (err, result)=>{
			res.send(result);
		})
	}else{
		const tag1 = value.split(",")[0];
		const tag2 = value.split(",")[1];
		const tag3 = value.split(",")[2];
		const sqlQuery = "SELECT * FROM qboard LEFT JOIN tag ON qboard.idx=tag.idx WHERE tag.tag1 IN (?,?,?) OR tag.tag2 IN (?,?,?) OR tag.tag3 IN (?,?,?) ORDER BY qboard.idx DESC"; //내림차순 정렬
		connection.query(sqlQuery, [tag1, tag2, tag3, tag1, tag2, tag3, tag1, tag2, tag3], (err, result)=>{
			res.send(result);
		})
	}
})

router.post("/searchtalk", (req, res)=>{
	const value = req.body.value;
	if(req.body.kind === "general"){
		const sqlQuery = "SELECT * FROM tboard LEFT JOIN category ON tboard.idx=category.idx WHERE tboard.title LIKE ? OR tboard.contents LIKE ? ORDER BY tboard.idx DESC"; //내림차순 정렬
		connection.query(sqlQuery, ['%' + value + '%', '%' + value + '%'], (err, result)=>{
			res.send(result);
		})
	}else if(req.body.kind === "tag"){
		const sqlQuery = "SELECT * FROM tboard LEFT JOIN category ON tboard.idx=category.idx WHERE tboard.category LIKE ? ORDER BY tboard.idx DESC"; //내림차순 정렬
		connection.query(sqlQuery, ['%' + value + '%'], (err, result)=>{
			res.send(result);
		})
	}else{
		const category1 = value.split(",")[0];
		const category2 = value.split(",")[1];
		const category3 = value.split(",")[2];
		const sqlQuery = "SELECT * FROM tboard LEFT JOIN category ON tboard.idx=category.idx WHERE category.category1 IN (?,?,?) OR category.category2 IN (?,?,?) OR category.category3 IN (?,?,?) ORDER BY tboard.idx DESC"; //내림차순 정렬
		connection.query(sqlQuery, [category1, category2, category3, category1, category2, category3, category1, category2, category3], (err, result)=>{
			res.send(result);
		})
	}
})


/*hitCount*/
router.post("/getHit", (req, res)=>{
	const idx = req.body.idx;
	const name = req.body.name;

	let sqlQuery = "UPDATE qboard SET hit = IFNULL(hit, 0) + 1 where idx = ?";
	if(name === "talk") sqlQuery = "UPDATE tboard SET hit = IFNULL(hit, 0) + 1 where idx = ?";

   	connection.query(sqlQuery, [idx], (err, result)=>{
		res.send('good');
	});
})

/*Tag List*/

router.post("/getTag", (req, res) => {
	const name = req.body.name;
	const tags=[];
	let sqlQuery;
	if(name === "talk") sqlQuery = "SELECT category1, category2, category3 FROM category";
	else if(name === "qna") sqlQuery = "SELECT tag1, tag2, tag3 FROM tag";
	
	connection.query(sqlQuery, (err, result) => {
		if(name === "qna"){
			for(let i=0; i<result.length; i++){
				if(result[i].tag1 !== null)
					tags.push(result[i].tag1);
				if(result[i].tag2 !== null)
					tags.push(result[i].tag2);
				if(result[i].tag3 !== null)
					tags.push(result[i].tag3);
			}
		}
		else if(name === "talk"){
			for(let i=0; i<result.length; i++){
				if(result[i].category1 !== null)
					tags.push(result[i].category1);
				if(result[i].category2 !== null)
					tags.push(result[i].category2);
				if(result[i].category3 !== null)
					tags.push(result[i].category3);
			}
		}
		res.send(tags);
	});
});


module.exports = router;
