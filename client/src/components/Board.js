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
	const [total, setTotal] = useState(0);
	const onGeneralSearchHandler = (event) => {setGeneralSearch(event.currentTarget.value);}
	const [loading, setLoading] = useState(false);

	let name = '';
	if(props.location !== undefined){
		name = props.match.path.split("/").[1];
	}else{
		name = props.match.split("/").[1];
	}

    let search = "태그";
    if (name === "talk") search = "카테고리";

    useEffect(() => {
		if (props.location !== undefined){
	        let value = props.match.params.q;
			if (name === "qna") {
				Axios.post('http://localhost:8000/board/searchqna', {
					value : value
				}).then((response) => {
					if(response.data.length === 0){
						setSearchValue([]);
					}
					else{
						setSearchValue(response.data);
					}
				})
			} else if (name === "talk") {
				Axios.post('http://localhost:8000/board/searchtalk', {
					value : value
				}).then((response) => {
					if(response.data.length === 0)
						setSearchValue([]);
					else{
						setSearchValue(response.data);
					}
				})
			}
	    }
		if (name ==="qna"){
			Axios.get('http://localhost:8000/board/getqTotal').then((response) => {
				setTotal(response.data[0].Total);
		})}
		else{
			Axios.get('http://localhost:8000/board/gettTotal').then((response) => {
				setTotal(response.data[0].Total);
		})}

		return () => setLoading(false);
	}, [searchValue, props.location, name, props.match])

	
    
    const searchBtn = (e) => {
    	setLoading(true);
    	if(props.location !== undefined)
			props.history.replace(`/${name}/search/${generalSearch}`);
		else
			props.history.push(`/${name}/search/${generalSearch}`);
		//props.history.push(`/${name}/search/${generalSearch}`);
	}

    return (   	
        <div className="menu__container">
			<h2>{name.toUpperCase()}</h2>		
			<div className="board_top">
				<p>총 게시물 {total}개</p>
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
				<div className="tagTitle left">{search}검색</div>
				<div className="right">
					<div className="tagInput">
						<input type="text" placeholder={`${search} 추가`}/>
					</div>
					<div className="tagBox"></div>
				</div>
			</div>
			
			<div className="board_contents">
			{(props.location !== undefined) ?
				((searchValue.length === 0) ? <div className="list"><p><strong>"{props.match.params.q}"</strong>와(과) 일치하는 검색 결과가 없습니다</p></div> 
				: List(searchValue, total, name))
			:
				((props.viewContent.length === 0) ? <div className="list"><p>등록된 게시물이 없습니다</p></div>
				: List(props.viewContent, total, name))
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

function List(mapper, total, name){
	return(
		mapper.map((element,i) =>(
			<div className="list" key={element.idx}>
				<div className="left">
					<h3>Q.{total-i}</h3>
					<p>답변 - {element.commentN}개</p>
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
								commentN : element.commentN,
								name : name
							}
						}}
					>
						<h3>{element.title}</h3>
					</Link>
					<p>{striptags(element.contents)}</p>

					<div>
						<div className="tags left">
							{element.category && <Link to="/#">{element.category}</Link>}
							{element.tag && <Link to="/#">{element.tag}</Link>}
						</div>
						<div className="info right">
							<p>작성자 : <span className="writer">{element.writer}</span> &nbsp;&nbsp;조회수 : <span className="hit">{element.hit}</span></p>
						</div>
					</div>
				</div>
			</div>
		))
	);
}

export default Board;