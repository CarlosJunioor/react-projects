import React, {useState, useEffect} from 'react';
import AdminHeader from '../../components/AdminHeader';
import Footer from '../../components/Footer';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { firestore, auth } from '../../config/firebase';
import { useAuth } from "../../config/context";
import { Link, useHistory } from "react-router-dom"

function Series() {

    const history = useHistory();
    const { currentUser } = useAuth();
    const [series, setSeries] = useState([]);


    useEffect(() => {
        if(currentUser) {
            auth.currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                if (!!idTokenResult.claims.admin) {
                    firestore.collection('series').get()
                    .then((querySnapshot) => {
                        var seriesArray = [];
                        querySnapshot.forEach((doc) => {
                            seriesArray.push({...doc.data(), id: doc.id})
                        });
                        setSeries(seriesArray)
                    })
                        .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    history.replace('/')
                }
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            history.replace('/')
        }
    },[])
  return (
    <>
        <AdminHeader />
        <div className='select-game'>
            <Container>
                <div className='section'>
                    <Row>
                        <Col md='3'>
                            <h3 style={{fontWeight:'800'}}>Series</h3>
                        </Col>
                        <Col md='9'>
                            <Link to={'/admin/series/create'}>
                                <Button style={{width:'400px',maxWidth:'100%', float:'right'}}>Create Series</Button>
                            </Link>
                        </Col>
                        
                    </Row>
                    <Row>
                        {series.map((series) => (
                            <Col md='3'>
                                <Card>
                                    <CardImg
                                        alt="Card image"
                                        src={series.medal}
                                        width="100%"
                                    />
                                    <CardBody>
                                    <CardTitle tag="h5">
                                        {series.name}
                                    </CardTitle>
                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                        {series.game}
                                    </CardSubtitle>

                                    <Link to={'/admin/series/' + series.id}>
                                    <Button>
                                        VIEW
                                    </Button>
                                    </Link>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
        <Footer />
    </>
  );
}

export default Series;
