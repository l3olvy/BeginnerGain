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


/*post comment total*/
router.post("/getqna_total", (req, res)=>{
	const bid = req.body.idx;
    const sqlQuery = "SELECT count(*) as Total FROM q_comment where bid=?";
    connection.query(sqlQuery, [bid], (err, result)=>{
    	res.send(result);
    })
})

router.post("/gettalk_total", (req, res)=>{
	const bid = req.body.idx;
    const sqlQuery = "SELECT count(*) as Total FROM t_comment where bid=?";
    connection.query(sqlQuery, [bid], (err, result)=>{
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

/*post 삭제 - comment도 같이 삭제됨  +qboard tag도 같이 삭제*/
router.post("/deleteqna", (req, res) => {
	const idx = req.body.idx;
	const bid = req.body.idx;
	const sqlQuery = "delete from qboard where idx=?;" + "delete from q_comment where bid=?;" + "delete from tag where idx=?;";
	connection.query(sqlQuery, [idx, bid, idx], (err, result) => {
		res.send('good!');
	})
});

router.post("/deletetalk", (req, res) => {
	const idx = req.body.idx;
	const bid = req.body.idx;
	const sqlQuery = "delete from tboard where idx=?;" + "delete from t_comment where bid=?;" + "delete from category where idx=?;";
	connection.query(sqlQuery, [idx, bid, idx], (err, result) => {
		res.send('good!');
	})
});

/*comment 삭제*/
router.post("/deleteqna_c", (req, res) => {	
	const idx = req.body.idx;
	const sqlQuery = "delete from q_comment where idx=?";"delete from q_comment where idx=?;"
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

/*comment 삭제 commentN-1*/
router.post("/deleteqna_cN", (req, res) => {	
	const commentN = req.body.commentN;
	const idx = req.body.idx;
	const sqlQuery = "UPDATE qboard SET commentN=? WHERE idx=?";
	connection.query(sqlQuery, [commentN, idx], (err, result) => {
		res.send('good!');
	})
});

router.post("/deletetalk_cN", (req, res) => {	
	const commentN = req.body.commentN;
	const idx = req.body.idx;
	const sqlQuery = "UPDATE tboard SET commentN=? WHERE idx=?";
	connection.query(sqlQuery, [commentN, idx], (err, result) => {
		res.send('good!');
	})
});

/*board-writing tag추가*/
router.post("/writing_qna", (req, res) => {
	const writer = req.body.writer;
	const title = req.body.title;
	const contents = req.body.contents;
	const img = req.body.img;
	const tag = req.body.tag;
	const hit = req.body.hit;

	const sqlQuery = "INSERT INTO qboard (writer, title, contents, img, tag, hit, rdate ) VALUES (?,?,?,?,?,?,NOW())";
	connection.query(sqlQuery, [writer, title, contents, img, tag, hit], (err, result)=>{
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
	const img = req.body.img;
	const category = req.body.category;
	const hit = req.body.hit;

	const sqlQuery = "INSERT INTO tboard (writer, title, contents, img, category, hit, rdate ) VALUES (?,?,?,?,?,?,NOW())";
	connection.query(sqlQuery, [writer, title, contents, img, category, hit], (err, result)=>{
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

/*update post + tag*/ 
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

/*comment insert / commentN+1*/
router.post("/postqna", (req, res) => {
	const bid = req.body.bid;
	const writer = req.body.writer;
	const contents = req.body.contents;
	const img = req.body.img;
	const good = req.body.good;
	const idx = req.body.bid;
	const commentN = req.body.commentN;

	const sqlQuery = "UPDATE qboard SET commentN=? WHERE idx=?;"+"INSERT INTO q_comment (bid, writer, contents, img, good, cdate) VALUES (?,?,?,?,?,NOW());";
	connection.query(sqlQuery, [commentN, idx, bid, writer, contents, img, good], (err, result)=>{
		res.send('good');
	})
});

router.post("/posttalk", (req, res) => {
	const bid = req.body.bid;
	const writer = req.body.writer;
	const contents = req.body.contents;
	const img = req.body.img;
	const good = req.body.good;
	const idx = req.body.bid;
	const commentN = req.body.commentN;

	const sqlQuery = "UPDATE tboard SET commentN=? WHERE idx=?;"+"INSERT INTO t_comment (bid, writer, contents, img, good, cdate) VALUES (?,?,?,?,?,NOW());";
	connection.query(sqlQuery, [commentN, idx, bid, writer, contents, img, good], (err, result)=>{
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
router.post("/getqHit", (req, res)=>{
	const idx = req.body.idx;
	const hit = req.body.hit;
	const sqlQuery = "UPDATE qboard SET hit=? WHERE idx=?"; //내림차순 정렬
   	connection.query(sqlQuery, [hit, idx], (err, result)=>{
		res.send('good');
	})
})

router.post("/gettHit", (req, res)=>{
	const idx = req.body.idx;
	const hit = req.body.hit;
	const sqlQuery = "UPDATE tboard SET hit=? WHERE idx=?"; //내림차순 정렬
   	connection.query(sqlQuery, [hit, idx], (err, result)=>{
		res.send('good');
	})
})

module.exports = router;
