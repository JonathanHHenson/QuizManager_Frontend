import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { default as Branding } from './Branding.json';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <Helmet>
            <meta charSet="utf-8"/>
            <link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
                integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
                crossOrigin="anonymous"
            />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>{Branding.title}</title>
        </Helmet>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
