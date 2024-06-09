import React, { useEffect, useState } from 'react'

function UsernameEmoji(props) {
	const [emojis, setEmojis] = useState([])
	const [name, setName] = useState(props.name)
	var temp = props.name;

	useEffect(() => {
		emoji(props.name);
	}, [props.name]);

	function emoji(str){
		if(props.emojis && props.emojis.length){
			var t = str
			props.emojis.map(emoji => {
				if(t.search(emoji.shortcode)){
					t = t.replace(`:${emoji.shortcode}:`, "")
					setName(t)
					setEmojis(prev => [...prev, emoji.url])
				}
			})
		}
    }

	return (
		<>
			<div>{name}
			{emojis.map((emoji) => {
				return <img className="emoji" src={emoji} height={"20px"} width={"20px"}/>
			})}
			</div>
		</>
		
	)
}

export default UsernameEmoji