import React from 'react';
import Header from '../components/Header';
import banner from '../assets/banner.png';
import { useHistory , Link} from 'react-router-dom'; 

function Home() {
    
    
    return (
        <>
            
            <h1>TEST</h1>
            <div style={{backgroundColor:'#000',padding:'20px',display:'flex',justifyContent:'center'}}>
                <img src={banner} width='200' alt='Varona Esports Gaming' />
            </div>
        </>
    )
}

export default Home;