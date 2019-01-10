import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoutes = ({
    user,
    component: Comp,
    ...rest
}) => {
    return <Route {...rest} component={(props)=>( //component equal to Dashboard according to privateRoutes parent
        user ?
            <Comp {...props} user={user}/>
            :
        <Redirect to="/sign_in"/>
    )}/>
};

export default PrivateRoutes;