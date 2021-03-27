import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Board.css";
import striptags from 'striptags';
import Axios from 'axios';
import TagBox from "./TagBox";
import qnaImg from '../css/qna.png';
import talkImg from '../css/talk.png';

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
	const [searchtotal, setSearchTotal] = useState(0);
	const onGeneralSearchHandler = (event) => {setGeneralSearch(event.currentTarget.value);}
	const [loading, setLoading] = useState(false);
	const [tags, setTags] = useState([]);
	let tagarray = [];

	const [tag, setTag] = useState([]);
	const [selSearch, setSelSearch] = useState('basic');

	let name = '';
	if(props.location !== undefined){
		name = props.match.path.split("/").[1];
	}else{
		name = props.match.split("/").[1];
	}

    let search = "태그";
    if (name === "talk") search = "카테고리";

    const loadList = async () => {
    	let url = "/board/getBoard/1/qna";
    	if(name === "talk") url = '/board/getBoard/1/talk';
    	await Axios.get(url).then((res)=>{
			setViewContent(res.data.model.boardList);
			setcurPage(res.data.model.currentPage);
            setlastPage(res.data.model.lastPage);
            setMinBtn(res.data.model.minBtn);
            setMaxBtn(res.data.model.maxBtn);
            setTotal(res.data.model.total);
		})
    }

    const loadSearch = async () => {
    	if (props.location !== undefined){
	        let value = props.match.params.q;
	        let kind = props.match.params.kind;
			if (name === "qna") {
				Axios.post('/board/searchqna', {
					value : value,
					kind : kind
				}).then((response) => {
					if(response.data.length === 0){
						setSearchValue([]);
					}
					else {
						setSearchValue(response.data);
						setSearchTotal(searchValue.length);
					}})

			} else {
				Axios.post('/board/searchtalk', {
					value : value,
					kind : kind
				}).then((response) => {
					if(response.data.length === 0)
						setSearchValue([]);
					else{
						setSearchValue(response.data);
						setSearchTotal(searchValue.length);
					}})	
			}
		}
	}	   
  

    const onClick = async (e) => {
    	const idxs = e.target.dataset.idx;
    	let url = "/board/getBoard/"+idxs+"/qna";
    	if(name === "talk") url = "/board/getBoard/"+idxs+"/talk";
    	
        await Axios.get(url).then((res) => {
            setcurPage(res.data.model.currentPage);
            setlastPage(res.data.model.lastPage);
            setMinBtn(res.data.model.minBtn);
            setMaxBtn(res.data.model.maxBtn);
            setViewContent(res.data.model.boardList);
            setTotal(res.data.model.total);
        })
    }

    useEffect(() => {
    	loadList();
    	loadSearch();
		return () => setLoading(false);
	}, [searchValue])
    
    const searchBtn = (e) => {
    	setLoading(true);
    	if(generalSearch.length ===0){
    		return;
    	}
    	if(props.location !== undefined)
			props.history.replace(`/${name}/search/general/${generalSearch}`);
		else
			props.history.push(`/${name}/search/general/${generalSearch}`);
	}

    const searchTagsBtn = (e) => {
    	setLoading(true);
    	if(tag.length ===0){
    		return;
    	}
    	if(props.location !== undefined)
			props.history.replace(`/${name}/search/tags/${tag}`);
		else
			props.history.push(`/${name}/search/tags/${tag}`);
	}

	const setOnTag = (tagset) =>{
		setTag(tagset);
	}

	const handledSearchType = async (e) => { setSelSearch(e.target.value);}

    return (   	
        <div className="menu__container">
        	<div className="board_background">
        		{name === "qna" ?
        			<img className="board_img" src={qnaImg}/>
        			:<img className="board_img" src={talkImg}/>
        		}
        		<div className="board_intro">
        			{name === "qna" ?
        			<div className="intro_sent">
		        		<h2>개발 중 발생하는 궁금한 점을 물어보세요.</h2>
		        		<p>다양한 오류에 관한 질문과 해당 카테고리만 분류해서 볼 수 있는 태그 검색까지!</p>
		        		</div>
		        		:<div className="intro_sent"><h2>개발에 대한 이야기를 자유롭게 나눠보세요.</h2>
		        		<p>관심 있는 직군부터 타직군에 관한 이야기를 들려주세요!</p></div>
		        	}
	        		<ul className="board_list">
		        		<li>
			        		<select name="searchType" onChange={handledSearchType}>
			        			<option value='basic'>제목+내용</option>
			        			<option value='tag'>태그</option>
			        		</select>
		        		</li>
	        			
						<li>
							{selSearch === 'basic' ? 
								<input type="text" placeholder="검색어를 입력하세요" onChange={onGeneralSearchHandler}/>
								:<div><TagBox change={setOnTag}></TagBox></div>
							}
						</li>
		        		<li>
		        			{selSearch === 'basic' ? 
								<button type="submit" onClick={searchBtn}>
									<FontAwesomeIcon icon={faSearch} size="2x" />
								</button>:
								<button type="submit" onClick={searchTagsBtn}>
									<FontAwesomeIcon icon={faSearch} size="2x" />
								</button>
							}

						</li>
	        		</ul>
	        	</div>
        	</div>
			<div className="board_top">
				<div className="left">
					<h2>{name.toUpperCase()}</h2>		
				</div>
				<div className="right">
				{((viewContent.length !== 0)&&(searchValue.length === 0)) ? 
					((props.location !== undefined) ? <p>총 게시물 0개 </p> : <p>총 게시물 {total}개</p>)
				: <p>총 게시물 {searchtotal}개</p>}
				</div>
			</div>        	
			

			
			<div className="board_contents">
			{(props.location !== undefined) ?
				((searchValue.length === 0) ? <div className="list"><p><strong>"{props.match.params.q}"</strong>와(과) 일치하는 검색 결과가 없습니다</p></div> 
				: List(searchValue, total, searchtotal, name, curPage, viewContent, searchValue))
			:
				((viewContent.length === 0) ? <div className="list"><p>등록된 게시물이 없습니다</p></div>
				: List(viewContent, total, searchtotal, name, curPage, viewContent, searchValue))
			}

			</div>
			
			<Link to={`/${name}/writing`}>
				<button className="writeBtn">글쓰기</button>
			</Link>

			{/* 페이징 */}
			<div className="paging">
				{ (curPage !== 1) && (<button className="pre" type="button" onClick={onClick} data-idx={curPage-1}>이전</button>) }
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

function List(mapper, total, searchtotal, name, curPage, viewContent, searchValue){
	return(
		mapper.map((element,i) =>(
			<div className="list" key={element.idx}>
				<div className="left">
					{(viewContent.length !== 0)&&(searchValue.length === 0) ? <h3>Q.{total - i - ((curPage-1)*5)}</h3> : <h3>Q.{searchtotal - i - ((curPage-1)*5)}</h3>}

					<p>답변 - {element.commentN}개</p>
				</div>
				<div className="right">
					<Link
						to={{
							pathname: `/${name}/post/${element.idx}`
						}}
					>
						<h3>{element.title}</h3>
					</Link>
					{element.contents.length > 69 ?
					<p>{striptags(element.contents).substring(0,69)+'...'}</p>
					:<p>{striptags(element.contents)}</p>
					}

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
							<span>작성자 : {element.writer} · 날짜 : {element.rdate.substring(0,10).replace(/-/g, '.')} · 조회수 : {element.hit}</span>
						
						</div>
					</div>
				</div>
			</div>
		))
	);
}

export default Board;