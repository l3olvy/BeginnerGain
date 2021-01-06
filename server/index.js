const express = require('express');
const app = express();
const PORT = process.env.port || 8000;

app.get('/', (req, res) => res.send("안녕! 바보야!"))

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});