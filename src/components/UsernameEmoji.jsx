import React, { useEffect, useState } from 'react'

//Component to display the username with emojis
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
			//search for emojis in the username and replace them with blank
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
			{/* loop through the identified emojis and display them at the end of the username */}
			{emojis.map((emoji) => {
				return <img className="emoji" src={emoji} height={"20px"} width={"20px"}/>
			})}
			</div>
		</>
		
	)
}

export default UsernameEmoji