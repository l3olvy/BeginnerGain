import React, {useState, useCallback, useEffect } from "react";
import "../css/Components.css";
import Axios from 'axios';

const TagItem = React.memo(({ tag, onRemove }) => (
	<div className="tagtest">{tag}<button className="btntest" onClick={() => onRemove(tag)}>x</button></div>
));

const TagList = React.memo(({tags, onRemove}) => (
	<div>
		{tags.map(tag => (
			<TagItem key={tag} tag={tag} onRemove={onRemove}/>
		))}
	</div>
));

const TagBox = ({change, ex_tags, name}) => {
	const [input, setInput] = useState('');
	const [localTags, setLocalTags] = useState([]);
	const [exTags, setExTags] = useState(ex_tags);
	const [tags, setTags] = useState([]);

	const tagSet = (localTags) =>{
		change(localTags);
	};

	useEffect(() => {
		tagSet(localTags);
		if(exTags){
			if(exTags.length !== 0){
				setLocalTags(exTags.filter(t => t !== "undefined"));
				setExTags([]);	
			}
		}
	}, [localTags]);

	useEffect(() => {
		if(name){
			Axios.post('/board/getTag', {
		        name : name
		    }).then((res) => {
		    	setTags(res.data);
		    });
		}

	}, []);

	const setClickTags = useCallback(e => {
		const tag = e.target.getAttribute('tags');
		if(localTags.length < 3){
			setLocalTags([...localTags, tag]);
		}
		setInput('');
	})

	const insertTag = useCallback(
		tag => {
			if(!tag) return;
			if(localTags.includes(tag)) return;
			if(localTags.length < 3){
				setLocalTags([...localTags, tag]);
			}
		},
		[localTags],
	);

	const onRemove = useCallback(
		tag => {
			setLocalTags(localTags.filter(t => t !== tag));
		},
		[localTags],
	);
	const onChange = useCallback(e => {
		setInput(e.target.value);
	}, []);

	const onlyOne = tags.filter((element, i) => {
		return tags.indexOf(element) === i;
	})

	const filteredTags = onlyOne.filter((onlyOne) => {
		if(onlyOne !== localTags[0] && onlyOne !== localTags[1] && onlyOne !== localTags[2])
			return onlyOne.toLowerCase().includes(input);
		
	});


	const onSubmit = useCallback(
		e => {
			insertTag(input.trim());
			setInput('');
		},
		[input, insertTag],
	);

	const handleKeyUp = useCallback(e =>{
		if(e.keyCode === 32){
			onSubmit();
		}
	})	


	return(
		<div className="TagBox">
			<div className="tag-box">
				<span className="tag-list left">
					<TagList tags={localTags} onRemove={onRemove}/>
				</span>
				{exTags ?
				<input
					className="tag-input"
					value={input}
					onChange={onChange}
					onKeyUp={handleKeyUp}
				/> :
				<input
					className="tag-input"
					placeholder="태그를 입력하세요"
					value={input}
					onChange={onChange}
					onKeyUp={handleKeyUp}
				/>
				}
			</div>
				{input &&
					filteredTags.length !==0 &&
					<div className="tag-set">
						{filteredTags.map((element,i) =>(
							<div onClick={setClickTags} tags={element}>
								<button onClick={setClickTags} tags={element}>{element}</button>
							</div>
						))}
					</div>
				}
				
		</div>
	);
};

export default TagBox;