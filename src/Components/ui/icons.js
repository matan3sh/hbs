import React from 'react';
import { Link } from 'react-router-dom';

import hbslogo from '../../Resources/images/logos/hbs_logo.png';

export const HBSLogo = (props) => {

    const template = <div className="img_cover"
                            style={{
                                    width: props.width, 
                                    height: props.height, 
                                    background: `url(${hbslogo}) no-repeat`
                            }}>
                    </div>

    if(props.link){
        return(
            <Link to={props.linkTo} className="link_logo">
                {template}
            </Link>
        )
    }else{
        return template
    }
}