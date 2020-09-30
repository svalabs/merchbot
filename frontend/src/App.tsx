import React, {useEffect, useState} from 'react';
import logo from './assets/logo.png';
import './App.css';

import ItemList from './json/items.json';
import Configuration from './json/config.json';

import CardColumns from 'react-bootstrap/CardColumns'
import Card from 'react-bootstrap/Card'
import Navbar from 'react-bootstrap/Navbar'
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {faSquare} from '@fortawesome/free-regular-svg-icons';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import Alert from 'react-bootstrap/cjs/Alert';

interface ItemFunc {
    (name: string): boolean | undefined
}

interface ItemCardProps {
    title: string,
    subtitle: string,
    raffle: boolean,
    image: string,
    getItem: ItemFunc,
    toggleItem: ItemFunc
}

const ItemCard = (props: ItemCardProps) => {

    return (<Card border="secondary">
        <Card.Img variant="top" src={props.image} className={'card-image'}/>
        <Card.Body>
            <Card.Title>{props.title} {props.raffle && <Badge pill variant="success">Verlosung</Badge>}</Card.Title>
            <Card.Text>
                {props.subtitle}
            </Card.Text>
        </Card.Body>
        <Card.Footer className={"card-footer"} onClick={() => props.toggleItem(props.title)}>
            <span className="fa-layers fa-fw">
                {props.getItem(props.title) && <FontAwesomeIcon className={"checkbox-icon"} icon={faCheck} fixedWidth={true} color="black"/>}
                <FontAwesomeIcon  fixedWidth={true}  icon={faSquare} color="#4791ff" transform="grow-6"/>
            </span>
        </Card.Footer>
    </Card>);
}

const HeaderElement = () => (
    <Navbar fixed="top" variant={'dark'} className={'main-navbar'}>
        <Navbar.Brand href="#home" className={"navbar-brand"}>
            <img
                alt=""
                src={logo}
                height="30"
                className="d-inline-block align-top navbar-logo"
            />
            {Configuration.title}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
                <Nav.Link href="#merch">Merch</Nav.Link>
                <Nav.Link href="#order">Bestellen</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

interface MastheadProps {
    children: React.ReactNode,
    cssClassName?: string,
    id?: string
}

const Masthead = (props: MastheadProps) => (
    <Jumbotron className={'jumbotron-header h-100'} id={props.id}>
        <div className={`jumbotron-bg ${props.cssClassName ? props.cssClassName : ''}` }/>
        <Container className={'jumbotron-text'}>
            {props.children}
        </Container>
    </Jumbotron>
);

const WelcomeScreen = () => (
    <Masthead cssClassName={'welcome-screen'}>
        <h1>{Configuration.title}</h1>
        {Configuration.description}
        <div className={'button-container'}>
            <Button size="lg" href={"#merch"}>
                Genug geredet, zeig mir den Merch!
            </Button>
        </div>
    </Masthead>
);

const SuccessScreen = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (<Masthead cssClassName={'success-screen'}>
        <h1>Success!</h1>
    </Masthead>);
};

function App() {

    const [items, setItems] = useState<Array<string>>([]);
    const [name, setName] = useState<string | null>();
    const [email, setEMail] = useState<string | null>();
    const [address, setAddress] = useState<string | null>();
    const [plz, setPLZ] = useState<string | null>();
    const [city, setCity] = useState<string | null>();

    const [error, setError] = useState<string | null>();
    const [success, setSuccess] = useState<boolean>(false);

    const getItem = (name: string) => (
        items.filter((entry) => entry === name).length !== 0
    );

    const toggleItem = (name: string) => {
        if(getItem(name)) {
            setItems(items.filter(entry => entry !== name));
            return true;
        }

        setItems([...items, name]);
        return true;
    }

  return (
    <div className="App">
        <HeaderElement/>
        <Container className={"h-100 masthead"} fluid id={'home'}>
            {success ? <SuccessScreen/> : <WelcomeScreen/>}
        </Container>
        {!success && <Container fluid="md" id={'merch'}>
            <h1>Verfügbarer Merch</h1>
            <Row>
                <Col>
                    <CardColumns>
                        {ItemList.map((item, key) => {
                            return <ItemCard getItem={getItem} toggleItem={toggleItem} {...item} key={key}/>;
                        })}
                    </CardColumns>
                </Col>
            </Row>
        </Container>}
        {!success && <Container fluid="md" className={"h-100"} id={'order'}>
            <h1>Merch bestellen</h1>
            <Form autoComplete={"on"} onSubmit={(data) => {
                data.preventDefault();
                data.stopPropagation();
                let payload = {
                    email,
                    name,
                    address,
                    plz,
                    items,
                    city
                };
                fetch('/submit', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify(payload)
                })
                    .then(response => {
                        if(!response.ok) {
                            response.json().then(data => {
                                if('error' in data) {
                                    setError(data.error);
                                    return;
                                }
                                throw new Error(response.statusText);
                            });

                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if('error' in data) {
                            setSuccess(false);
                            setError(data.error);
                            return;
                        }
                        setError(null);
                        setSuccess(true);

                        const successScreen = document.getElementById("success-screen");
                        successScreen && successScreen.scrollIntoView();
                        // TODO: Redirect
                    })
                    .catch(err => {
                        setError(`Internal server error: ${err.message}`);
                        setSuccess(false);
                    });
            }}>
                {error && <Alert variant="danger">
                    {error}
                </Alert>}

                <Form.Group controlId="formEmail">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control required type="email" title="Bitte eine gültige E-Mail-Adresse verwenden" placeholder="max.mustermann@beispiel.de" name={"shipping email"} autoComplete="email" onChange={(event) => setEMail(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required type="text" placeholder="Max Mustermann" name={"name"} autoComplete="shipping name" onChange={(event) => setName(event.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formAddress">
                    <Form.Row>
                        <Col>
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control required placeholder="Musterweg 123" name={"address"} autoComplete="shipping street-address" onChange={(event) => setAddress(event.target.value)}/>
                        </Col>
                        <Col>
                            <Form.Label>PLZ</Form.Label>
                            <Form.Control required placeholder="12345" title={"Bitte eine gültige Postleitzahl verwenden"} pattern="^[0-9]{5}$" name={"zip"} autoComplete="shipping postal-code" onChange={(event) => setPLZ(event.target.value)}/>
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group controlId="formCity">
                    <Form.Label>Ort</Form.Label>
                    <Form.Control required type="text" placeholder="Musterstadt" name={"ship-city"} autoComplete="shipping address-level2" onChange={(event) => setCity(event.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check required type="checkbox" label={<>
                        Ich stimme der <a href={Configuration.privacy}>Datenschutzerklärung</a> zu
                    </>}/>

                </Form.Group>

                <Button variant="primary" type="submit">
                    Bestellen
                </Button>
            </Form>
        </Container>}
        <Container fluid id={'footer'}>
                <span>Powered by <a href={"https://www.sva.de"}>SVA</a></span>
                <span>MerchBot on <a target={"_blank"} href={"https://github.com/svalabs/merchbot"}>GitHub <FontAwesomeIcon icon={faGithub} /></a></span>
                <span><a href={Configuration.imprint}>Impressum</a></span>
        </Container>
    </div>
  );
}

export default App;
