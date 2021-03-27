import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Components.css";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko'; 
import striptags from 'striptags';
import slash from'./slash.png';

registerLocale('ko', ko);

function News(props) {
   const [news, setNews] = useState([]);
   //const [sum, setSum] = useState([]);
   const [startDate, setStartDate] = useState(new Date('1-01-2009'));
   const [endDate, setEndDate] = useState(new Date('1-01-2009'));
   const [keyword, setKeyword] = useState('');
   const [key, setKey] = useState('');
   const [mode, setMode] = useState(false); //과거뉴스 / 최신뉴스
   const [des, setDes] = useState([{id:''}]);
   const [sum, setSum] = useState([{
      id: '',
      sum0: '',
      sum1: '',
      sum2: ''
   }]);
   //new Array(news.length).fill(false)
   const [disabledNewBtn, setDisabledNewBtn] = useState([false, false, false, false, false, false, false, false, false, false]);
   const [disabledBtn, setDisabledBtn] = useState(new Array(news.length).fill(false));

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

   const convertnewDate = str => {
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
      return parts[3] + months[parts[2]] + parts[1];
   };

   const convertTitle = str => {
      str = str.toString();
      str = str.replace(/"&lt;"/g,"<");
   	str = str.replace(/"&gt;"/g,">");
   	str = str.replace(/&quot;/g,'"');
   	str = str.replace(/"&#39;"/g,"'");	
 	    return str;
 	};

 	const convertDes1 = str => {
      str = str.toString();
      let parts = str.split("...");
      return parts[0]
  	};
  	const convertDes2 = str => {
      str = str.toString();
      let parts = str.split("...");
      return parts[1]
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
      Axios.post('/getNews', {
         start : convertDate(startDate),
         end : convertDate(endDate)
      }).then((res) => {
         setNews(res.data);
         setKeyword(res.data[0]);
      })
   }

   console.log(news);


   const getSumBtn = (e) => {      
      const index = e.target.getAttribute('sum_idx');
      disabledBtn[index] = true;
      Axios.post('/getSum', {
         paragraph: e.target.getAttribute('paragraph')
      }).then((res) => {
         setSum([
            ...sum,
            {
            id: index,
            sum0: res.data[0].sum,
            sum1: res.data[1].sum,
            sum2: res.data[2].sum
         }]);
      })
   }

   const getKeywordNews = (e) => {
      setKey(e.target.getAttribute('keyword'));
   }

   const delSum = (e) => {
      const index = e.target.getAttribute('del_idx');
      setSum(sum.filter(sum => parseInt(sum.id) !== parseInt(index)));
      disabledBtn[index] = false;
   }
   const delDes = (e) => {
      const index = e.target.getAttribute('del_idx');
      setDes(des.filter(des => parseInt(des.id) !== parseInt(index)));
      disabledNewBtn[index] = false;
   }

   const brandNews = (e) => {
      setNews([]);
      setMode(true);
      setDes([]);
      Axios.post('/getbrandNews', {      
      }).then((res) => {
         setNews(res.data);
      })
   }
      console.log(des);
   return (      
      <div>
         <div className="newstop">
            <div>
            <h2>과거 뉴스 / 최신 뉴스</h2>
            <p>요약된 IT 뉴스로 과거부터 최신까지 빠르게 트렌드를 읽어보세요.</p>
            <table className="buttontable" border="1">
               <tr>
                  <td><button className="newsbtn" onClick={ (e) => {setNews([]); setSum([]); setKeyword(''); setKey(''); setMode(false); }}>과거 뉴스</button> </td>
                  <td><img src={slash}/></td>
                  <td><button className="newsbtn" onClick={brandNews}>최신 뉴스</button> </td>
               </tr>
               <tr>
                  <td><p>과거의 기간별 키워드를 통해 확인</p></td>
                  <td></td>
                  <td><p>오늘을 포함한 최근의 IT 뉴스 확인</p></td>
               </tr>
            </table>  
            </div>
         </div>

         <div className="menu__container">
            { mode ? <h2>NEWS - 최신 뉴스</h2>  : <h2>NEWS - 과거 뉴스</h2>}    
            <div className="board_top">
               {news.length !== 0 ?  mode ? <p>총 게시물 {news.length}개 </p> : <p>총 게시물 {news.length - 1}개 </p>  :<p>총 게시물 {news.length}개 </p>  }
            </div>

            { mode ? 
            <div>
               <div className="tagSearch">
                  <div className="tagTitle left">NO.</div>
                  <div className="tagTitle2 left">기사 제목</div>
                  <div className="tagTitle4 right">요약</div>
                  <div className="tagTitle3 right">발행일</div>
               </div>
               <div className="news_contents">
                  {news.length !== 0 &&
                     news.map((element, i) =>(
                        element.length === undefined &&(
                           <div className="newslist" key={i}>
                              <div>
                                 <div className="left">
                                    <p>{i+1}</p>
                                 </div>
                                 <div className="right">
                                    <div>
                                       <div className="title left">
                                          <h3>{convertTitle(striptags(element.title))}</h3>
                                       </div>
                                       <div className="summary right">
                                          <button type="submit" onClick={ (e) => { disabledNewBtn[i] = true; setDes([...des,{id:i}]); }}
                                          disabled={disabledNewBtn[i]} description_idx={i}>요약 보기</button>
                                       </div>
                                       <div className="title right">
                                          <h4>{convertnewDate(element.pubDate)}</h4>
                                       </div>
                                    </div>
                                 </div>   
                              </div>
                              {des.length !== 0 &&(
                                 des.map((el)=> (
                                    parseInt(el.id) === i &&(
                                    <div className="sumdiv">   
                                       <p>첫번째 문장: {convertDes1(striptags(element.description))}...</p>
                                       <p>두번째 문장: {convertDes2(striptags(element.description))}...</p>
                                       <button onClick={() => window.open(`${element.link}`, '_blank')}>원문 보기</button>
                                       <button onClick={delDes}  del_idx={el.id} >닫기</button>
                                    </div>
                                 )))
                              )}
                           </div>            
                        )
                     ))
                  }
               </div>
            </div>
         :  <div>
               <div className="keywordSearch">                   
                  <div>
                     <p>조회 기간</p>                     
                     <FontAwesomeIcon className="calendericon" icon={faCalendar} size="1x" />
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
                  </div>
                  <p>ㅡ</p>
                  <div>                        
                     <FontAwesomeIcon className="calendericon" icon={faCalendar} size="1x" />
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
                     <button type="submit" onClick={getNewsBtn}>
                        <FontAwesomeIcon icon={faSearch} size="1x"/>
                     </button>                        
                  </div>                  
               </div>




               <div className="tagSearch">
                  <div className="tagTitle left">키워드</div>
               </div>

               <div>
                  {keyword.length !== 0 &&
                     keyword.map((element) =>(
                        <button onClick={getKeywordNews} keyword={element}>{element}</button>
                     ))}
               </div>
               
               {news.length !== 0 &&
                  <div className="line"></div>
               }

               <div className="news_contents">
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
                                                <button type="submit" disabled={disabledBtn[i]} onClick={getSumBtn} paragraph={element.paragraph} sum_idx={i}>요약</button>
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
            }{/*mode*/}
         </div>
      </div>
   );
}

export default News;