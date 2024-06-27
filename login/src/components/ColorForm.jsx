import React, { useState } from 'react'

function ColorForm() {
    const [selected, setSelected] = useState(1)
    return (
        <div>
            <div className='button-group'>
                <div className={selected === 1 ? 'selected' : 'button-group-tab'} onClick={() => setSelected(1)}>RGB</div>
                <div className={selected === 2 ? 'selected' : 'button-group-tab'} onClick={() => setSelected(2)}>HSL</div>
                <div className={selected === 3 ? 'selected' : 'button-group-tab'} onClick={() => setSelected(3)}>Hex</div>
            </div>
        </div>
    )
}

export default ColorForm