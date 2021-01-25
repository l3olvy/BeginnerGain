import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import "../css/Menu.css";
import Axios from 'axios';

function Qna(props) {
	const [viewContent, setViewContent] = useState([]);
    let boardnum_qna=0;
	let nowPage = 1;

	const listCount = 10;
	let startPage = (nowPage - 1) * listCount;
	
	useEffect(()=>{
		Axios.get('http://localhost:8000/board/getqna/1').then((response)=>{
			setViewContent(response.data);
		})

	}, []) 

	return (
		<div className="menu__container">
			<Board viewContent={viewContent} name="QNA" match={props.match.path}/>
		</div>
	);

}

export default Qna;