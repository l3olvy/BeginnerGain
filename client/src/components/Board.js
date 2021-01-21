import React from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";
import striptags from 'striptags';

function Board({ viewContent, name, match }) {
    let search = "태그";
    if (name === "TALK") search = "카테고리";

    return (
        <div className="menu__container">
			<h2>{name}</h2>
			
			<div className="board_top">
				<p>총 게시물 126개</p>
				<ul className="board_list">
					<li>
						<input type="text" placeholder="검색"/>
					</li>
					<li>
					<button type="submit">
						<FontAwesomeIcon icon={faSearch} size="2x" />
					</button>
					</li>
				</ul>
			</div>

			<div className="tagSearch">
				<div className="tagTitle left">{search} 검색</div>
				<div className="right">
					<div className="tagInput">
						<input type="text" placeholder={`${search} 추가`}/>
					</div>
					<div className="tagBox"></div>
				</div>
			</div>

			{viewContent.map(element =>(
				<div className="board_contents" key={element.idx}>
					{/* 이 구간은 select문을 통해 반복될 예정 */}
					<div className="list">
						<div className="left">
							<h3>Q.{element.idx}</h3>
							<p>답변 - 13개</p>
						</div>
						<div className="right">
							<Link
								to={{
									pathname: `${match}/post/${element.idx}`,
									state: {
										idx : element.idx,
										writer : element.writer,
										title : element.title,
										contents : element.contents,
										tag : element.tag,
										category : element.category,
										hit : element.hit,
										rdate : element.rdate,
										name : name
									}
								}}
							>
								<h3>{element.title}</h3>
							</Link>
							<p>{striptags(element.contents)}</p>

							<div>
								<div className="tags left">
									{(name === "TALK") ? <Link to="/#">{element.category}</Link> : <Link to="/#">{element.tag}</Link> }
								</div>
								<div className="info right">
									<p>작성자 : <span className="writer">{element.writer}</span> &nbsp;&nbsp;조회수 : <span className="hit">{element.hit}</span></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
			
			<Link to={`${match}/writing`}>
				<button className="writeBtn">글쓰기</button>
			</Link>

			{/* 페이징 */}
			<div className="paging">
				<Link className="disabled" to="/#">처음</Link>
				<Link className="disabled" to="/#">이전</Link>

				{/* 페이징 계산 구간 */}
				<Link className="selected" to="/#">1</Link>
				<Link to="/#">2</Link>
				<Link to="/#">3</Link>
				<Link to="/#">4</Link>
				<Link to="/#">5</Link>

				<Link to="/#">다음</Link>
				<Link to="/#">끝</Link>
			</div>
		</div>
    );
}

export default Board;