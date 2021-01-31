import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";
import striptags from 'striptags';
import Axios from 'axios';

function Board(props) {
	// 페이징
	const [viewContent, setViewContent] = useState([]);
	const [curPage, setcurPage] = useState(0);
	const [lastPage, setlastPage] = useState(0);
	const [minbtn, setMinBtn] = useState(0);
	const [maxbtn, setMaxBtn] = useState(0);
	let array = [];

	const [generalSearch, setGeneralSearch] = useState('');
	const [searchValue, setSearchValue] = useState([]);
	const [total, setTotal] = useState(0);
	const onGeneralSearchHandler = (event) => {setGeneralSearch(event.currentTarget.value);}
	const [loading, setLoading] = useState(false);
	const [tags, setTags] = useState([]);
	let tagarray = [];

	let name = '';
	if(props.location !== undefined){
		name = props.match.path.split("/").[1];
	}else{
		name = props.match.split("/").[1];
	}

    let search = "태그";
    if (name === "talk") search = "카테고리";

    const loadList = async () => {
    	let url = "http://localhost:8000/board/getBoard/1/qna";
    	if(name === "talk") url = 'http://localhost:8000/board/getBoard/1/talk';
    	await Axios.get(url).then((res)=>{
			setViewContent(res.data.model.boardList);
			setcurPage(res.data.model.currentPage);
            setlastPage(res.data.model.lastPage);
            setMinBtn(res.data.model.minBtn);
            setMaxBtn(res.data.model.maxBtn);
		})
    }

    const loadSearch = async () => {
    	if (props.location !== undefined){
	        let value = props.match.params.q;
	        let kind = props.match.params.kind;
			if (name === "qna") {
				Axios.post('http://localhost:8000/board/searchqna', {
					value : value,
					kind : kind
				}).then((response) => {
					if(response.data.length === 0){
						setSearchValue([]);
					}
					else {
						setSearchValue(response.data);
					}})
			
			} else if (name === "talk") {
				Axios.post('http://localhost:8000/board/searchtalk', {
					value : value,
					kind : kind
				}).then((response) => {
					if(response.data.length === 0)
						setSearchValue([]);
					else{
						setSearchValue(response.data);
					}
				})
			}
	    }
    }

    const onClick = async (e) => {
    	const idxs = e.target.dataset.idx;
    	let url = "http://localhost:8000/board/getBoard/"+idxs+"/qna";
    	if(name === "talk") url = "http://localhost:8000/board/getBoard/"+idxs+"/talk";
    	
        await Axios.get(url).then((res) => {
            setcurPage(res.data.model.currentPage);
            setlastPage(res.data.model.lastPage);
            setMinBtn(res.data.model.minBtn);
            setMaxBtn(res.data.model.maxBtn);
            setViewContent(res.data.model.boardList);
        })
    }

    useEffect(() => {
    	loadList();
    	loadSearch();
		if (name ==="qna"){
			Axios.get('http://localhost:8000/board/getqTotal').then((response) => {
				setTotal(response.data[0].Total);
		})}
		else{
			Axios.get('http://localhost:8000/board/gettTotal').then((response) => {
				setTotal(response.data[0].Total);
		})}

		return () => setLoading(false);
	}, [searchValue])
	
    
    const searchBtn = (e) => {
    	setLoading(true);
    	if(props.location !== undefined)
			props.history.replace(`/${name}/search/general/${generalSearch}`);
		else
			props.history.push(`/${name}/search/general/${generalSearch}`);
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
				: List(searchValue, total, name, curPage))
			:
				((viewContent.length === 0) ? <div className="list"><p>등록된 게시물이 없습니다</p></div>
				: List(viewContent, total, name, curPage))
			}

			</div>
			
			<Link to={`/${name}/writing`}>
				<button className="writeBtn">글쓰기</button>
			</Link>

			{/* 페이징 */}
			<div className="paging">
				{ (curPage !== 1) && (<button type="button" onClick={onClick} data-idx={curPage-1}>이전</button>) }
				{
					(() => {
						for(let i = minbtn; i < maxbtn; i++) {
							if(curPage === i) array.push(<button type="button" className="checkBtn" key={i} onClick={onClick} data-idx={i}>{i}</button>);
							else array.push(<button type="button" onClick={onClick} key={i} data-idx={i}>{i}</button>);
							if(i >= lastPage) break;
						}
						return (array);
					})()
				}
				{ (curPage < lastPage) && (<button type="button" onClick={onClick} data-idx={curPage+1}>다음</button>) }
			</div>
		</div>
    );
}

function List(mapper, total, name, curPage){
	return(
		mapper.map((element,i) =>(
			<div className="list" key={element.idx}>
				<div className="left">
					<h3>Q.{total - i - ((curPage-1)*5)}</h3>
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
							{element.category && (
								<span>
									{(element.category1 !== null) && 
									<Link to={`/${name}/search/tag/${element.category1}`}>{element.category1}</Link>}
									{(element.category2 !== null) && 
									<Link to={`/${name}/search/tag/${element.category2}`}>{element.category2}</Link>}
									{(element.category3 !== null) && 
									<Link to={`/${name}/search/tag/${element.category3}`}>{element.category3}</Link>}
								</span>
							)}
							{element.tag && (
								<span>
									{(element.tag1 !== null) && 
									<Link to={`/${name}/search/tag/${element.tag1}`}>{element.tag1}</Link>}
									{(element.tag2 !== null) && 
									<Link to={`/${name}/search/tag/${element.tag2}`}>{element.tag2}</Link>}
									{(element.tag3 !== null) && 
									<Link to={`/${name}/search/tag/${element.tag3}`}>{element.tag3}</Link>}
								</span>
							)}
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