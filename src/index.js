import ReactDOM from 'react-dom';
import App from './App';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import './App.css';

ReactDOM.render(
<>
<ToastContainer/>
<App/>
</>,
document.querySelector('#root'));