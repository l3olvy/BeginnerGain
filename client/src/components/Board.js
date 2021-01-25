import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";
import striptags from 'striptags';
import Axios from 'axios';

function Board(props) {
	const [generalSearch, setGeneralSearch] = useState('');
	const [searchValue, setSearchValue] = useState([]);
	const onGeneralSearchHandler = (event) => {setGeneralSearch(event.currentTarget.value);}

	let name = '';
	if(props.location !== undefined){
		name = props.match.path.split("/").[1];
	}else{
		name = props.match.split("/").[1];
	}

    let search = "태그";
    if (name === "talk") search = "카테고리";

    useEffect(() => {
		if (props.location !== undefined) {
			loadSearch();
		}
	}, [searchValue])

	const loadSearch = async () => {
        let value = props.match.params.q;

		if (name === "qna") {
			Axios.post('http://localhost:8000/board/searchqna', {
				value : value
			}).then((response) => {
				if(response.data.length === 0)
					alert("검색 결과가 없습니다");
				else{
					setSearchValue(response.data);
				}
			})
		} else if (name === "talk") {
			Axios.post('http://localhost:8000/board/searchtalk', {
				value : value
			}).then((response) => {
				if(response.data.length === 0)
					alert("검색 결과가 없습니다");
				else{
					setSearchValue(response.data);
				}
			})
		}
    }

    const searchBtn = (e) => {
		props.history.push(`/${name}/search/${generalSearch}`);
	}


    return (
        <div className="menu__container">
        {console.log(searchValue)}
			<h2>{name.toUpperCase()}</h2>
			
			<div className="board_top">
				<p>총 게시물 126개</p>
				<ul className="board_list">
					<li>
						<input type="text" placeholder="검색" onChange={onGeneralSearchHandler}/>
					</li>
					<li>
					<button type="submit" onClick={searchBtn}>
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
			
			<div className="board_contents">
			{(props.location !== undefined) ?
					searchValue.map(element =>(
						<div className="list" key={element.idx}>
							<div className="left">
								<h3>Q.{element.idx}</h3>
								<p>답변 - 13개</p>
							</div>
							<div className="right">
								<Link
									to={{
										pathname: `/${name}/post/${element.idx}`,
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
										{(name === "talk") ? <Link to="/#">{element.category}</Link> : <Link to="/#">{element.tag}</Link> }
									</div>
									<div className="info right">
										<p>작성자 : <span className="writer">{element.writer}</span> &nbsp;&nbsp;조회수 : <span className="hit">{element.hit}</span></p>
									</div>
								</div>
							</div>
						</div>
					)) :
					(props.viewContent.length === 0) ? <div className="list"><p>등록된 게시물이 없습니다</p></div> :
					props.viewContent.map(element =>(
						<div className="list" key={element.idx}>
							<div className="left">
								<h3>Q.{element.idx}</h3>
								<p>답변 - 13개</p>
							</div>
							<div className="right">
								<Link
									to={{
										pathname: `${props.match}/post/${element.idx}`,
										state: {
											idx : element.idx,
											writer : element.writer,
											title : element.title,
											contents : element.contents,
											tag : element.tag,
											category : element.category,
											hit : element.hit,
											rdate : element.rdate,
											name : props.name
										}
									}}
								>
									<h3>{element.title}</h3>
								</Link>
								<p>{striptags(element.contents)}</p>

								<div>
									<div className="tags left">
										{(props.name === "TALK") ? <Link to="/#">{element.category}</Link> : <Link to="/#">{element.tag}</Link> }
									</div>
									<div className="info right">
										<p>작성자 : <span className="writer">{element.writer}</span> &nbsp;&nbsp;조회수 : <span className="hit">{element.hit}</span></p>
									</div>
								</div>
							</div>
						</div>
					)) 
				}
			</div>
			
			
			<Link to={`/${name}/writing`}>
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