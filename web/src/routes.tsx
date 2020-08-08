import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Writer from './pages/Writer/Writer';

function Routes(){
    return (
        <BrowserRouter>
            <Route path="/" exact component={Landing} />
            <Route path="/writer" component={Writer} />
        </BrowserRouter>
    )
}

export default Routes;