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
			console.log(res.data);
			setNews(res.data);
			setKeyword(res.data[0]);
		})
	}
	console.log("news : ", news);
	//console.log("keyword : ", keyword[1]);

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


//   console.log("자료:", news[1]);
	const delSum = (e) => {
	  setSum(sum.filter(sum => parseInt(sum.id) !== parseInt(e.target.getAttribute('del_idx'))));
	}
	console.log("sum : ", sum);

   return (      
        <div className="menu__container">
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
   );
}

export default News;