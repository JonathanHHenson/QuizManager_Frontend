import React from 'react'
import { default as Branding } from './Branding.json'
import UserStore from "./stores/UserStore";
import { observer } from 'mobx-react'
import { Image, Form, Button, Container, Row, Col } from 'react-bootstrap'

class LoginForm extends React.Component<{}, {username: string, password: string, buttonDisabled: boolean}> {

    constructor(props: {}) {
        super(props)
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(property: string, value: string) {
        property = property.toLowerCase()
        value = value.trim()
        if (property == 'username' && value.length > 20 || property == 'password' && value.length > 256) {
            return
        }
        this.setState({
            ...this.state,
            [property]: value
        })
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin() {
        if (!(this.state.username && this.state.password)) {
            return
        }
        this.setState({
            buttonDisabled: true
        })
        try {
            let response = await fetch('/_apis/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            })
            let result = await response.json()
            if (result && result.success) {
                UserStore.username = result.username
                UserStore.permission = result.permission
                UserStore.isLoggedIn = true
            } else if (result && result.success === false) {
                this.resetForm()
                alert(result.msg)
            }
        } catch (e) {
            console.log(e)
            this.resetForm()
        }
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Image src={Branding.logo} />
                </Row>
                <Form>
                    <Row md={2} xs={1}>
                        <Col>
                            <Form.Group controlId="formGroupUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='text'
                                              placeholder='Username'
                                              value={this.state.username}
                                              onChange={
                                                  (control) =>
                                                      this.setInputValue('username', control.currentTarget.value)
                                              } />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password'
                                              placeholder='Password'
                                              value={this.state.password}
                                              onChange={
                                                  (control) =>
                                                      this.setInputValue('password', control.currentTarget.value)
                                              } />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-end">
                            <Button variant='primary'
                                    type='button'
                                    onClick={ () => this.doLogin() }
                                    disabled={ this.state.buttonDisabled }>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default observer(LoginForm)