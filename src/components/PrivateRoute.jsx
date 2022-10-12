import React from 'react';
import {Route,useHistory} from 'react-router-dom';
import {decode} from 'jsonwebtoken';


export default function PrivateRoute(props){

    //console.log(props);
    const path=props.path;
    const Component=props.component;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    
    const getTokenExp=()=>{
       try{
            if(authToken!==null) return decode(authToken).exp;
            redirectToLogin();
       }catch(err){
            redirectToLogin();
      }
    }

    const redirectToLogin=()=>history.push('/login');
    const checkAuthToken=()=>Date.now()>=getTokenExp()*1000 ? false: true;

    return <Route path={path} render={()=>{
        return checkAuthToken() ?<Component props={props}/>:
        <p>Login in to continue. Redirecting to login...{redirectToLogin()}</p>
    }}></Route>

}