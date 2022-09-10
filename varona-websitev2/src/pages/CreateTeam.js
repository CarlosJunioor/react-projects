import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Button, FormGroup, Input } from 'reactstrap';
import { firestore } from '../config/firebase';
import { useHistory } from "react-router-dom";
import { useAuth } from "../config/context";
import { v4 as uuidv4 } from 'uuid';

function TeamCreation () {

    const history = useHistory();
    const { currentUser } = useAuth();
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState({});
    const [nameError, setNameError] = useState('');
    const [files, setFiles] = useState('');

    const createTeam = () => {
        let validation = 0;

        if(newTeam.name === '' || newTeam.name === ' ' || newTeam.name === undefined) {
            setNameError('Team name cannot be blank.')
        } else if(teams.includes(newTeam.name.toLowerCase())) {
            setNameError('This team name is already in use.')
        } else {
            validation++
        }

        if(validation === 1) {
            firestore.collection('teams').add({
                name: newTeam.name,
                logo: files,
                members: [currentUser.uid],
                captain: currentUser.uid,
                invite_code: uuidv4().slice(0,8)
            }).then(() => {
                history.replace('/teams')
            }).catch((error) => {
                console.log(error)
            })
            
        }
        
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
      }

    const handleChange = async (event) => {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setFiles(base64)
    }

    useEffect(() => {
        if(currentUser === null) {
            history.replace('/login')
        } else {
            firestore.collection('teams').get()
            .then((querySnapshot2) => {
                var listofteams = [];
                querySnapshot2.forEach((doc2) => {
                    listofteams.push(doc2.data().name.toLowerCase())
                })
                console.log(listofteams)
                setTeams(listofteams)
            })
        }
    }, [])

  return (
    <>
        <Header />
        <div style={{backgroundColor:'#000',padding:'20px',display:'flex',justifyContent:'center'}}><h1 style={{color:'#fff',fontWeight:'800',margin:'0'}}>CREATE A TEAM</h1></div>
        <div className='select-game'>
        <Container>
                    <div style={{padding:'5% 0px'}}>
                        <center>
                            <div style={{backgroundColor:'#fff',padding:'40px 20px',borderRadius:'10px',maxWidth:'1000px',border:'1px solid #ccc'}}>
                                <h5 style={{margin:'0'}}>New Team Name</h5>
                                <FormGroup style={{marginTop:'10px'}}>
                                    <Input type="text" id="ign" value={newTeam.name} onChange={(e) => {
                                        setNameError('')
                                        setNewTeam({...newTeam, name: e.target.value})
                                    }} style={{height:'50px',width:'400px',maxWidth:'100%'}} invalid={ nameError === '' ? false : true}/>
                                    {nameError !== '' && <p style={{margin:'0',color:'red'}}>{nameError}</p>}
                                </FormGroup>
                                <br/>
                                <h5 style={{margin:'0'}}>Team Logo</h5>
                                <br/>
                                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                                <br /><br />
                                {files && <>
                                <p>Here is how your team logo will look:</p>
                                <div style={{width:'300px', height:'300px', aspectRatio:'1/1', backgroundColor:'#eee', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'10px'}}>
                                    <img src={files} style={{maxWidth:'100%',borderRadius:'10px',aspectRatio:'1/1',objectFit:'cover'}} />
                                </div>
                                </>}
                            </div>
                            <Button className="profile-next-btn" onClick={createTeam} style={{backgroundColor:'#242425',height:'50px',width:'200px'}} size="lg">CREATE TEAM</Button>
                        </center>
                    </div>
                    </Container>
        </div>
        <Footer />
    </>
  );
}

export default TeamCreation;
