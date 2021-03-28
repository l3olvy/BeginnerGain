import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

function Home(props) {
	return (
		<div className="Home">
			{/* visual */}
			<div id="visual" style={{ backgroundImage: 'url("/img/main_img.png")' }}>
				<div className="width_box">
					<div id="visual_title">
						<h2>BeginnerGain</h2>
						<p>Beginner : 초보자, Gain : 얻다</p>
						<h3>한국 <span>초보 개발자</span>들을 위한 <span>개발자 커뮤니티</span></h3>
					</div>
				</div>	
			</div>

			{/* News */}
			<div className="width_box">
				<div id="news_intro">
					<div className="intro_title">
						<div className="title_bar1"></div>
						<h3>NEWS</h3>
					</div>

					<div className="left" style={{ backgroundImage: 'url("/img/News_intro.png")' }}>
					</div>
					
					<div className="right">
						<h3>과거 뉴스부터 최신 뉴스까지 <span>요약된 정보</span>로 IT 트렌드를 읽어보세요</h3>
						<p>BeginnerGain의 뉴스는 과거와 현재의 IT 흐름을 한눈에  볼 수 있습니다.</p>

						<p>
							과거 뉴스를 클릭해 원하는 기간으로 검색 할 경우 해당 기간의 이슈였던<br />
							키워드를 볼 수 있으며, 키워드를 클릭할 시 키워드가 포함된 기사 목록과<br />
							 세 문장으로 요약한 기사의 결과를 확인할 수 있습니다.<br />
						</p>

						<p>최신뉴스를 클릭할 경우 오늘을 포함한 최근 IT뉴스의 요약한 결과를 빠르게<br />
							확인 가능 합니다. </p>

						<Link to="/news">바로가기</Link>
					</div>
				</div>
			</div>

			{/* Complier */}
			<div id="compiler_intro" style={{ backgroundImage: 'url("/img/compiler_back.png")' }}>
				<div className="width_box">
					<div className="intro_title">
						<div className="title_bar2"></div>
						<h3>COMPILER</h3>
					</div>

					<div id="compiler_info">
						<h3>밖에서 <span>간단한 코딩</span>을 해야 할 때<br />혹은 다른 언어를 사용해야 하는데 <span>프로그램은 없을 때</span></h3>			
						<p>BeginnerGain에서는 다양한 언어의 <span>온라인 웹 컴파일러</span>를 지원하고 있습니다.<br />원하는 언어로 간편하게 코드 컴파일을 도와 드리겠습니다.   </p>
					</div>

					<Link to="/compiler">바로가기</Link>
				</div>					
			</div>

			{/* QNA, TALK */}
			<div id="board_intro">
				<div className="width_box">
					<div className="intro_title">
						<div className="title_bar1"></div>
						<h3>QNA / TALK</h3>
					</div>					

					<div id="board_con">
						<ul>
							<li>
								<div>
									<div className="board_img left" style={{ backgroundImage: 'url("/img/qna_intro.png")' }}></div>
									<div className="board_img right">
										<h3>QNA</h3>
										<h3>개발 중 발생하는 궁금한 점을<br/>질문해 보세요.</h3>

										<p>
											다양한 오류에 대한 질문과<br />
											답변을 공유하며 검색해 보세요.<br />
											원하는 카테고리만 볼 수 있는<br />
											태그 검색도 가능합니다.
										</p>

										<Link to="/qna">바로가기</Link>
									</div>
								</div>
							</li>
							<li>
								<div>
									<div className="board_img left" style={{ backgroundImage: 'url("/img/talk_intro.png")' }}></div>
									<div className="board_img right">
										<h3>TALK</h3>
										<h3>개발과 관련된 이야기를<br/>자유롭게 나눠 보세요.</h3>

										<p>
											평소에 관심이 있었던 주제와<br/>
											다른 직군에 관해 이야기를<br/>
											나누어 보고 나의 직군에 대한<br/>
											이야기를 들려주세요. <br/>
										</p>

										<Link to="/talk">바로가기</Link>
									</div>
								</div>
							</li>
						</ul>			
					</div>
				</div>
			</div>

			{/* chat */}
			<div id="chat_intro" style={{ backgroundImage: 'url("/img/chat_back.png")' }}>
				<div className="width_box">
					<div className="intro_title">
						<div className="title_bar2"></div>
						<h3>CHAT</h3>
					</div>

					<div id="chat_info">
						<h3><span>실시간 채팅</span>으로 도움을 요청해 보세요</h3>
						<p>
							BeginnerGain의 채팅 기능을 통해 실시간으로 도움을 요청할 수 있습니다.<br/>
							일반 메시지를 보낼수 있을 뿐만 아니라, 실시간으로 코드를 컴파일 하여<br/>
							결과를 공유할 수도 있습니다. 많은 사람들에게 도움을 요청하고 받으세요.<br/>
						</p>

						<p>
							또한 메시지를 보내 친목을 다지며 다양한 이야기를 나누는 대화의 장을<br/>
							펼쳐 보세요. 현재 이슈가 되는 이야기 뿐만 아니라 소소한 일상 이야기까지<br/>
							언택트 시대, 상대방과 함께 이야기 하면 즐거움이 두배가 됩니다.<br/>
						</p>
						<Link to="/chat">바로가기</Link>
					</div>

				</div>
			</div>
		</div>
	);
}

export default Home;