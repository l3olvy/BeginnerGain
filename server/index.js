const express = require('express');
const mysql = require('mysql');
const dbconfig = require('./database.js');
const connection = mysql.createConnection(dbconfig);
const app = express();
const serveStatic = require("serve-static");
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir:"./images"});
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.port || 8000;

app.set('port', PORT);
// app.use("/public", serveStatic(path.join(__dirname, "public")));

const path = require('path');
const fs = require('fs');
const { error } = require('console');

app.use(cors());	
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true})); 

// Routing 등록
const member = require("./routes/member");
app.use("/member", member);

const board = require("./routes/board");
app.use("/board", board);


/*ckeditor image upload 구현*/
app.get('/', (req, res)=>{
	res.status(200).json({
		message: "testing our server"
	})
})

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
	console.log(req.files);
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});

module.exports = app;