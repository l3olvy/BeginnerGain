import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import Axios from 'axios';

function Talk(props) {
	const [viewContent, setViewContent] = useState([]);

	useEffect(()=>{
		Axios.get('http://localhost:8000/board/gettalk').then((response)=>{
			setViewContent(response.data);
		})
	}, [])

	return (
		<div className="menu__container">
			<Board
				viewContent = {viewContent}
				name="TALK"
				match={props.match.path}/>
		</div>
	);
}

export default Talk;