import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

function News(props) {
	const [news, setNews] = useState([]);
	//const [sum, setSum] = useState([]);
	const [startDate, setStartDate] = useState(new Date('1-01-2009'));
	const [endDate, setEndDate] = useState(new Date('1-01-2009'));
	const [keyword, setKeyword] = useState('');
	const [key, setKey] = useState('');
	const [sum, setSum] = useState([{
		id: '',
		sum0: '',
		sum1: '',
		sum2: ''
	}]);

	const convertDate = str => {
		str = str.toString();
		let parts = str.split(" ");
		let months = {
			Jan: "01",
			Feb: "02",
			Mar: "03",
			Apr: "04",
			May: "05",
			Jun: "06",
			Jul: "07",
			Aug: "08",
			Sep: "09",
			Oct: "10",
			Nov: "11",
			Dec: "12"
		};
		return parts[3] + months[parts[1]] + parts[2];
	};

	const ExampleCustomInput = ({ value, onClick }) => (
		<button className="example-custom-input" onClick={onClick}>
			{value}
		</button>
	);

	const getNewsBtn = (e) => {
		setNews([]);
		setSum([]);
		setKeyword('');
		Axios.post('http://localhost:8000/getNews', {
			start : convertDate(startDate),
			end : convertDate(endDate)
		}).then((res) => {
			setNews(res.data);
			setKeyword(res.data[0]);

		})
	}
	console.log("news : ", news);
	console.log("keyword : ", keyword[1]);

	const getSumBtn = (e) => {
		
		Axios.post('http://localhost:8000/getSum', {
			paragraph: e.target.getAttribute('paragraph')
		}).then((res) => {
			setSum([
				...sum,
				{
				id: e.target.getAttribute('sum_idx'),
				sum0: res.data[0].sum,
				sum1: res.data[1].sum,
				sum2: res.data[2].sum
			}]);
		})
	}

	const getKeywordNews = (e) => {
		setKey(e.target.getAttribute('keyword'));
	}
	console.log("키버튼:", key);


	console.log("자료:", news[1]);

	const delSum = (e) => {
		setSum(sum.filter(sum => parseInt(sum.id) !== parseInt(e.target.getAttribute('del_idx'))));
	}
	console.log("sum : ", sum);

	return (   	
        <div className="menu__container">
			<h2>NEWS</h2>		
			<div className="board_top">
				{news.length !== 0 ?
					<p>총 게시물 {news.length - 1}개 </p>
					:<p>총 게시물 {news.length}개 </p>
				}
			</div>

			<div className="tagSearch">
				<div className="tagTitle left">과거 뉴스</div>
				<div className="tagTitle left">최신 뉴스</div>
			</div>
	
			<div className="newsSearch">
				<ul className="keywordSearch">
					<li>
						<DatePicker
							selected={startDate}
							onChange={date => setStartDate(date)}
							showYearDropdown
							dateFormatCalendar="MMMM"
							dateFormat="yyyy년 MM월 dd일 ▼"
							minDate={new Date('1-01-2009')}
							maxDate={new Date('12-27-2018')}
							yearDropdownItemNumber={15}
							scrollableYearDropdown
							locale="ko"
							customInput={<ExampleCustomInput />}
						/>
					</li>
					<li><p>—</p></li>
					<li>
						<DatePicker
							selected={endDate}
							onChange={date => setEndDate(date)}
							showYearDropdown
							dateFormatCalendar="MMMM"
							dateFormat="yyyy년 MM월 dd일 ▼"
							minDate={new Date('1-01-2009')}
							maxDate={new Date('12-27-2018')}
							yearDropdownItemNumber={15}
							scrollableYearDropdown
							locale="ko"
							customInput={<ExampleCustomInput />}
						/>
					</li>
					<li>
					<button type="submit" onClick={getNewsBtn}>
						<FontAwesomeIcon icon={faSearch} size="1x" />
					</button>
					</li>
				</ul>
			</div>
			{keyword.length !== 0 &&
				<div>
					<button onClick={getKeywordNews} keyword={keyword[0]}>{keyword[0]}</button>
					<button onClick={getKeywordNews} keyword={keyword[1]}>{keyword[1]}</button>
					<button onClick={getKeywordNews} keyword={keyword[2]}>{keyword[2]}</button>
					<button onClick={getKeywordNews} keyword={keyword[3]}>{keyword[3]}</button>
					<button onClick={getKeywordNews} keyword={keyword[4]}>{keyword[4]}</button>
				</div>
			}
			
			{news.length !== 0 &&
				<div className="line"></div>
			}
			<div className="board_contents">
				{news.length !== 0 &&
					news.map((element, i) =>(
						element.length === undefined &&(
							key.length !== 0 &&(
								element.keyword.includes(key) === true &&(
									<div className="newslist" key={element.document_id}>
										<div>
											<div className="left">
												<p>{element.publisher}</p>
												<h5>{element.date}</h5>
											</div>
											<div className="right">
												<div>
													<div className="title left">
														<h3>{element.title}</h3>
														<p>작성자 : {element.author}</p>
													</div>
													<div className="summary right">
														<button type="submit" onClick={getSumBtn} paragraph={element.paragraph} sum_idx={i}>요약</button>
													</div>
												</div>
											</div>
										</div>
										{sum.length !== 0 &&(
											sum.map((el) =>(
												parseInt(el.id) === i &&(
												<div className="sumdiv">
													<button onClick={delSum} del_idx={el.id}>X</button>
													<p>1 : {el.sum0}</p>
													<p>2 : {el.sum1}</p>
													<p>3 : {el.sum2}</p>
													<button onClick={() => window.open(`${element.link}`, '_blank')}>뉴스 더 보기</button>
												</div>
											)))
										)}
									</div>
								)
							)
						)
					))
				}
			</div>
		</div>
	);
}

export default News;