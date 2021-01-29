import React, { useEffect, useState } from "react";
import Board from "../components/Board";

function Talk(props) {
	return (
		<div className="menu__container">
			<Board match={props.match.path} history={props.history} />
		</div>
	);
}

export default Talk;