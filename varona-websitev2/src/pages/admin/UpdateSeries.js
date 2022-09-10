import React, {useState, useEffect} from 'react';
import AdminHeader from '../../components/AdminHeader';
import SmallFooter from '../../components/SmallFooter';
import { firestore, auth } from '../../config/firebase';
import { Container, Row, Col, FormFeedback, FormGroup, Input, Button, Table } from 'reactstrap';
import { useAuth } from "../../config/context"
import { Link, useHistory, useParams } from "react-router-dom"

function UpdateSeries() {
    const history = useHistory()
    const [profile, setProfile] = useState({});
    const [ignError, setIgnError] = useState('');
    const [files, setFiles] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(true)
    const [updated, setUpdated] = useState(false)
    let { id } = useParams();
    const [series, setSeries] = useState({});
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([])
    const { currentUser } = useAuth();

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


    const updateEvent = () => {
        firestore.collection('series').doc(id).set({
            ...series
        })
        .then(() => {
            setUpdated(true)
            setUpdated(false)
            setAlertMessage('success')
            window.scrollTo(0,0);
        })
        .catch((error) => {
            console.log(error)
            alert(error.message)
            setAlertMessage('fail')
        })
        
    }

    const handleChange = async (event) => {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setSeries({
            ...series,
            medal: base64
        })
    }

    useEffect( async() => {
        if(currentUser) {
            await auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.admin) {
                    firestore.collection('series').doc(id).get()
                    .then((doc) => {
                        setSeries({
                            ...doc.data(),
                        })
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });

                } else {
                    history.replace('/')
                }
            });
            setLoading(false)
        }
        
      }, [updated])
  return (
    <>
        <AdminHeader />
            <div className='select-game' style={{minHeight:'100vh'}}>
                <Container>
                    {loading === true ? null : <div style={{padding:'5% 0px'}}>
                        <center>
                            <h2 style={{fontWeight:'900'}}>Edit Series Details</h2>
                                <>
                                {alertMessage === 'success'? <div style={{display:'inline-block',backgroundColor:'mediumspringgreen',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Success!</strong> Your series has been updated!</p></div> : alertMessage === 'fail' ? <div style={{display:'inline-block',backgroundColor:'indianred',padding:'10px',borderRadius:'10px',marginBottom:'15px'}}><p style={{margin:'0'}}><strong>Uh oh!</strong> Looks like you have some errors to fix!</p></div> : null}
                                <br />
                                <img src={files === '' ? series.medal : files } style={{maxWidth:'100%'}} />
                                <br/>
                                <input type="file" id="profile-image" accept="image/png, image/gif, image/jpeg" onChange={handleChange} />
                                <br/>
                                <br/>
                                <h5 style={{margin:'0'}}>Series Name</h5>
                                <Row style={{justifyContent:'center'}}>
                                    <FormGroup style={{marginTop:'10px'}}>
                                        <Input type="text" id="ign" value={series.name} onChange={(e) => {
                                            setIgnError('')
                                            setSeries({...series, name: e.target.value})
                                        }} style={{height:'50px',width:'400px',maxWidth:'100%'}} invalid={ ignError === '' ? false : true}/>
                                        <FormFeedback style={{width:'100%',textAlign:'left'}}>{ignError}</FormFeedback>
                                    </FormGroup>
                                </Row>
                                </>
                            <Button className="profile-next-btn" style={{backgroundColor:'#242425',height:'50px'}} onClick={updateEvent} size="lg">Update Series</Button>
                        </center>
                    </div>}
                    
                </Container>
            </div>
        <SmallFooter />
    </>
  );
}

export default UpdateSeries;
