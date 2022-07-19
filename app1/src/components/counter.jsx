import React from "react";

const {useState} = React;

export default function counter() {

    const [counter, setCounter] = useState(0);

    return (

        <div className='counter'>
            <p>test</p>

            <p>{counter}</p>

        </div>
    )
}