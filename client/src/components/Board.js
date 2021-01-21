import React from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";
import striptags from 'striptags';

function Board({viewContent, name, match}) {

  let search = "태그";
  if(name === "TALK")
     search = "카테고리";
  return (
    <div className="menu__container">
       <h2>{name}</h2>
             
      <div className="board_top">
          <p>총 게시물 126개</p>
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
         <div className="tagTitle left">{search} 검색</div>
         <div className="right">
            <div className="tagInput">
               {/* 검색 버튼을 없앴는데 그 이유는 input에 focus 되면 밑에 태그 목록이 뜨고 태그를 클릭하면 바로 검색 되는 형식으로 하려고 */}
               {/* 그리고 위에 검색창에서도 검색 버튼 누를 때마다 태그박스에 태그가 있는지 확인 해야함 있으면 and 조건으로 검색 */}
               <input type="text" placeholder={search}/>
            </div>
            <div className="tagBox"></div>
         </div>
      </div>

       {viewContent.map(element =>(

         <div className="board_contents">
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
                          key : element.idx,
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
                <h3>{element.title}</h3></Link>
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
         <Link to={`${match}/writing`}><button className="writeBtn">글쓰기</button></Link>

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