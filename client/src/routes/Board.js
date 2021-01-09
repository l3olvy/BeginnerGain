import React, { Component } from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";

function Board(props) {
  return (
    <div className="menu__container">
    	<h2>QNA</h2>
    			
		<div className="board_top">
    		<p>총 게시물 192개</p>
    		<ul className="board_list">
    			<li><input type="text" placeholder="검색"/></li>
    			<li>
    				<button type="submit">
    					<FontAwesomeIcon icon={faSearch} size="2x" />
    				</button>
    			</li>
    		</ul>
    	</div>

		<div className="tagSearch">
			<div className="tagTitle left">태그 검색</div>
			<div className="right">
				<div className="tagInput">
					{/* 검색 버튼을 없앴는데 그 이유는 input에 focus 되면 밑에 태그 목록이 뜨고 태그를 클릭하면 바로 검색 되는 형식으로 하려고 */}
					{/* 그리고 위에 검색창에서도 검색 버튼 누를 때마다 태그박스에 태그가 있는지 확인 해야함 있으면 and 조건으로 검색 */}
					<input type="text" placeholder="태그 추가하기"/>
				</div>
				<div className="tagBox"></div>
			</div>
		</div>

	    <div className="board_contents">
        	{/* 이 구간은 select문을 통해 반복될 예정 */}
			<div className="list">
				<div className="left">
					<h3>Q.15</h3>
					<p>답변 - 13개</p>
				</div>
				<div className="right">
					<h3>졸리다. 메이플 하고 싶다. 아크 키워주고 싶다.</h3>
					<p>스크립트를 놔두고 리액트를 쓰는 이유는 무엇인가~? 아크는 잘생겼다. 메이플 헤어성형 돌릴거다. 방탄 패키지도 사야하는데.. 메이플 헤어성형 돌릴거다. 방탄 패키지도 사야하는데..</p>
					
					<div>
						<div className="tags left">
							<Link to="/#">Java</Link>
							<Link to="/#">PHP</Link>
						</div>
						<div className="info right">
						 	<p>작성자 : <span className="writer">Goeun</span> &nbsp;&nbsp;조회수 : <span className="hit">50</span></p>
						</div>
					</div>
				</div>
			</div>
			<div className="list">
				<div className="left">
					<h3>Q.15</h3>
					<p>답변 - 13개</p>
				</div>
				<div className="right">
					<h3>졸리다. 메이플 하고 싶다. 아크 키워주고 싶다.</h3>
					<p>스크립트를 놔두고 리액트를 쓰는 이유는 무엇인가~? 아크는 잘생겼다. 메이플 헤어성형 돌릴거다. 방탄 패키지도 사야하는데.. 메이플 헤어성형 돌릴거다. 방탄 패키지도 사야하는데..</p>
					
					<div>
						<div className="tags left">
							<Link to="/#">Java</Link>
							<Link to="/#">PHP</Link>
						</div>
						<div className="info right">
						 	<p>작성자 : <span className="writer">Goeun</span> &nbsp;&nbsp;조회수 : <span className="hit">50</span></p>
						</div>
					</div>
				</div>
			</div>
			<div className="list">
				<div className="left">
					<h3>Q.15</h3>
					<p>답변 - 11개</p>
				</div>
				<div className="right">
					<h3>졸리다. 메이플 하고 싶다. 아크 키워주고 싶다.</h3>
					<p>스크립트를 놔두고 리액트를 쓰는 이유는 무엇인가~? 아크는 잘생겼다. 메이플 헤어성형 돌릴거다. 방탄 패키지도 사야하는데.. 메이플 헤어성형 돌릴거다. 방탄 패키지도 사야하는데..</p>
					
					<div>
						<div className="tags left">
							<Link to="/#">Java</Link>
							<Link to="/#">PHP</Link>
							<Link to="/#">C#</Link>
						</div>
						<div className="info right">
						 	<p>작성자 : <span className="writer">푸르딩딩딩딩</span> &nbsp;&nbsp;조회수 : <span className="hit">50</span></p>
						</div>
					</div>
				</div>
			</div>
       </div>


		{/* 페이징 */}
	   	<div className="paging">
			
				<Link className="disabled">처음</Link>
				<Link className="disabled">이전</Link>

				{/* 페이징 계산 구간 */}
				<Link className="selected">1</Link>
				<Link>2</Link>
				<Link>3</Link>
				<Link>4</Link>
				<Link>5</Link>

				<Link>다음</Link>
				<Link>끝</Link>
			
	   	</div>
	
    </div>
  );
}

export default Board;