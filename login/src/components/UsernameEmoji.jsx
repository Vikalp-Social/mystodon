import React, { useEffect, useState } from 'react'

function UsernameEmoji(props) {
	const [emojis, setEmojis] = useState([])
	const [name, setName] = useState(props.name)

	console.log(props)

	useEffect(() => {
		emoji(props.name)	
	}, [props.name, props.emojis]);

	function emoji(str){
        var emojis = /(?<=:)\w+(?=:)/g.exec(str);
        if(emojis && props.emojis.length){
            emojis.map(emoji => {
                let custom_emoji = props.emojis.find((value) => value.shortcode === emoji)
                setName(() => str.replace(`:${emoji}:`, ""))
				setEmojis(prev => [...prev, custom_emoji.url])
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