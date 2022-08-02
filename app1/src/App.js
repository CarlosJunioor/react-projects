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
        
        

        <button onClick={() => {
            setCounter(counter+1);
        }}>Inc Counter</button>

        </>
    )
}

export default App