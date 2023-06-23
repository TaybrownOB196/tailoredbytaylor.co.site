import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';

//sass
import '../sass/index.scss';

// ReactDOM.render(
//     <React.StrictMode>
//         <Provider store={store}>
//             <App/>
//         </Provider>
//     </React.StrictMode>, document.getElementById('root'));
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root'));