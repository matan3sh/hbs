import React from 'react';
import { HBSLogo } from '../ui/icons';

const Footer = () => {
    return (
        <footer className="bck_blue">
            <div className="footer_logo">
                <HBSLogo width="70px" height="70px" link={true} linkTo="/"/>
            </div>
            <div className="footer_discl">
                Dev By Matan Shaviro for Hapoel Beer-Sheva 2019.All rights reserved
            </div>
        </footer>
    );
};

export default Footer;