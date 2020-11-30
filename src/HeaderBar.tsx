import React from 'react'
import { default as Branding } from './Branding.json'
import { Navbar, Image } from 'react-bootstrap'
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css'
import UserStore from "./stores/UserStore";
import { observer } from "mobx-react";


class HeaderBar extends React.Component<{title: string}, {}> {
    async doLogout() {
        try {
            let response = await fetch('/_apis/logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let result = await response.json()

            if (result && result.success) {
                UserStore.username = ''
                UserStore.permission = ''
                UserStore.isLoggedIn = false
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                    <Link to={'/'}>
                        <Image src={Branding.logo} height={100} width={100} />
                    </Link>
                </Navbar.Brand>
                <Navbar.Brand>
                    <h1>{this.props.title}</h1>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: <a onClick={this.doLogout}>{UserStore.username + ' '} <span className="fa fa-sign-out" /></a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default observer(HeaderBar)