const express = require('express');
const app = express();
const PORT = process.env.port || 8000;
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({uploadDir:"./images"});
const morgan = require('morgan');

const path = require('path');

const fs = require('fs');

const { error } = require('console');
	
app.use(bodyparser.urlencoded({extended: true})); 
app.use(bodyparser.json());

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
