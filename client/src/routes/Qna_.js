import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import "../css/Menu.css";
import Axios from 'axios';

function Qna(props) {
	const [viewContent, setViewContent] = useState([]);
    
	
	useEffect(()=>{
		Axios.get('http://localhost:8000/board/getqna/1').then((response)=>{
			console.log(response);
		})

	}, []) 

	return (
		<div className="menu__container">
			<Board viewContent = {viewContent} name="QNA" match={props.match.path} history={props.history}/>
		</div>
	);

}

export default Qna;