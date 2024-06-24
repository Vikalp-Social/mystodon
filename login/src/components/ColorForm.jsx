import React, { useState } from 'react'

function ColorForm() {
    //const [selected, setSelected] = useState(1)
    return (
        <div>
            <div className='button-group'>
                <div className='selected'>RGB</div>
                <div className='button-group-tab'>HSL</div>
                <div className='button-group-tab'>Hex</div>
            </div>
        </div>
    )
}

export default ColorForm