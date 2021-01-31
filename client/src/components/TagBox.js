import React, {useState, useCallback, useEffect } from "react";
import "../css/Components.css";

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

const TagBox = ({change}) => {
	const [input, setInput] = useState('');
	const [localTags, setLocalTags] = useState([]);

	const tagSet = (localTags) =>{
		change(localTags);
	};

	useEffect(() => {
		tagSet(localTags);
	}, []);

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
tagSet(localTags);
	const onRemove = useCallback(
		tag => {
			setLocalTags(localTags.filter(t => t !== tag));
		},
		[localTags],
	);

	const onChange = useCallback(e => {
		setInput(e.target.value);
	}, []);

	const onSubmit = useCallback(
		e => {
			insertTag(input.trim());
			setInput('');
		},
		[input, insertTag],
	);

	const handleKeyPress = useCallback(e =>{
		if(e.keyCode === 32)
			onSubmit();
	})	


	return(
		<div>
			<input
				className="tag-input"
				placeholder="태그를 입력하세요"
				value={input}
				onChange={onChange}
				onKeyDown={handleKeyPress}
			/>
			<span className="tag-list">
				<TagList tags={localTags} onRemove={onRemove}/>
			</span>
		</div>
	);
};

export default TagBox;