import React from 'react';
import discord_cta from '../assets/banner.png';
import {
  Button,
  Container
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {

  return (
      <>
    <div style={{backgroundColor:'#121212',display:'flex',justifyContent:'center',width:'100%',padding:'40px 0px'}}>
        <Container>
            <center>
            <img src={discord_cta} width='400' style={{maxWidth:'100%'}} />
            
            <p style={{textAlign:'center',color:'#fff'}}>Our discord community!</p>
            <Button style={{backgroundColor:'#fff',color:'#121212',padding:'10px 40px'}} size='md'>Join The Discord</Button>
            </center>
        </Container>
        
    </div>
    <div style={{display:'flex',justifyContent:'center',width:'100%',padding:'40px 0px'}}>
        <FontAwesomeIcon icon={faTwitter} size='2x' href='https://twitter.com/EsportsVarona' cursor='pointer' style={{margin:'10px'}} />
        <FontAwesomeIcon icon={faInstagram} size='2x' href='https://www.instagram.com/varonaesports/' cursor='pointer' style={{margin:'10px'}} />
    </div>
    <div style={{backgroundColor:'#000',padding:'40px 0px'}}>
        <Container className='copyright' style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
            <p style={{textAlign:'center',color:'#fff',margin:'0'}}>&copy; 2020 Varona eSports Inc. All Rights Reserved</p>
            <p style={{textAlign:'center',color:'#fff',margin:'0'}}>Terms Of Service</p>
        </Container>
    </div>
    </>
  );
}

export default Footer;