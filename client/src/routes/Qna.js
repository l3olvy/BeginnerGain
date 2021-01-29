import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import "../css/Menu.css";

function Qna(props) {
	return (
		<div className="menu__container">
			<Board match={props.match.path} history={props.history}/>
		</div>
	);

}

export default Qna;