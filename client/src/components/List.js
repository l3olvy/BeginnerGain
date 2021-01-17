import React from "react";
import { Link } from "react-router-dom";
import "../css/Components.css";

function List({idx, writer, title, contents, tag, category, hit, rdate, name}) {

  let kind = tag;
  if(name === "TALK"){
  	kind = category;
  }
  
  return (

      <div className="board_contents">
        	{/* 이 구간은 select문을 통해 반복될 예정 */}
				<div className="list">
					<div className="left">
						<h3>Q.{idx}</h3>
						<p>답변 - 13개</p>
					</div>
					<div className="right">
						<Link
					        to={{
					          pathname: `/qna/${idx}`,
					          state: {
					          	idx,
					            writer,
					            title,
					            contents,
					            tag,
					            hit,
					            rdate,
					            name
					          }
					        }}
					      >
						<h3>{title}</h3></Link>
						<p>{contents}</p>
						
						<div>
							<div className="tags left">
								<Link to="/#">{kind}</Link>
							</div>
							<div className="info right">
							 	<p>작성자 : <span className="writer">{writer}</span> &nbsp;&nbsp;조회수 : <span className="hit">{hit}</span></p>
							</div>
						</div>
					</div>
				</div>
       </div>
  );
}

export default List;