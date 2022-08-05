import React from 'react';
import Header from './components/header';

const {useState} = React;

function App (){

    const [counter, setCounter] = useState(0);
    const idade = 10 +20
   

    return(
        <>
        <Header/>

        <p>{counter} TESTE COUNTER</p>
        <p>{counter} TESTE COUNTER</p>
        <p>{counter} tESTE COUNTER</p>
        <p>{counter} tESTE COUNTER</p>
        <p>{idade}</p>
        <h1>hello this is a test commit</h1>
        <h2> HI THIS IS A TEST COMMIT 2</h2>
        <h3> this is a test commit 3</h3>
        <h3> this is a test commit 4</h3>
        
        

        <button onClick={() => {
            setCounter(counter+1);
        }}>Inc Counter</button>

        </>
    )
}

export default App