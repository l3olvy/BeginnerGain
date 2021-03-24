import React from "react";
import '../css/Components.css';
import errimg from '../css/code-error.png';

function NotFound() {
    return (
    	<div className="notfound">
    		<img src={errimg}/>
    		<h2>요청하신 페이지를 찾을 수 없습니다.</h2>
    		<p>존재하지 않는 주소를 입력하셨거나, <br/>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다. <br/>입력하신 주소가 정확한지 다시 한 번 확인해 주시기 바랍니다.</p>
    	</div>
    );
}

export default NotFound;