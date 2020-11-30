import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect, RouteComponentProps
} from "react-router-dom"
import { observer } from 'mobx-react'
import UserStore from "./stores/UserStore"
import LoginForm from "./LoginForm";
import QuizzesView from "./QuizzesView";
import QuizView from "./QuizView";
import EditQuizView from "./EditQuizView";

import './App.css'

class App extends React.Component<{}, {loaded: boolean}> {
    constructor(props: RouteComponentProps<{}>) {
        super(props)
        this.state = {
            loaded: false
        }
    }

    async componentDidMount() {
        try {
            let response = await fetch('/_apis/isLoggedIn', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let result = await response.json()

            if (result && result.success) {
                UserStore.username = result.username
                UserStore.permission = result.permission
                UserStore.isLoggedIn = true
            } else {
                UserStore.permission = ''
                UserStore.isLoggedIn = false
            }
        } catch (e) {
            UserStore.permission = ''
            UserStore.isLoggedIn = false
        }
        this.setState({loaded: true})
    }

    render() {
        if (this.state.loaded) {
            return (
                <Router>
                    <Switch>
                        <Route exact path='/login'>
                            {UserStore.isLoggedIn ? <Redirect to="/quizzes"/> : <LoginForm/>}
                        </Route>
                        <Route exact path='/quizzes'>
                            {UserStore.isLoggedIn ? <QuizzesView/> : <Redirect to="/login"/>}
                        </Route>
                        <Route exact path='/quiz/:quizId'>
                            {UserStore.isLoggedIn ? <QuizView/> : <Redirect to="/login"/>}
                        </Route>
                        <Route exact path='/quiz/:quizId/_edit'>
                            {UserStore.isLoggedIn ? <EditQuizView/> : <Redirect to="/login"/>}
                        </Route>
                        <Route exact path="/">
                            {UserStore.isLoggedIn ? <Redirect to="/quizzes"/> : <Redirect to="/login"/>}
                        </Route>
                    </Switch>
                </Router>
            )
        }

        return (
            <p>Loading...</p>
        )
    }
}

export default observer(App)
