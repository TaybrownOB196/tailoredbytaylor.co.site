import React from 'react';
import SocialMediaButtonComponent from '../buttons/SocialMediaButtonComponent';

import facebookSvg from './../../../svg/5365678_fb_facebook_facebook_logo_icon.svg'
import linkedinSvg from './../../../svg/5296501_linkedin_network_linkedin_logo_icon.svg'
import fiverrSvg from './../../../svg/fiverr.svg'
import githubSvg from './../../../svg/github.svg'

class SocialMediaTrayComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='socialMediaTray'>
                <SocialMediaButtonComponent
                    imageSrc={linkedinSvg} 
                    redirectUrl={'https://www.linkedin.com/in/taylor-brown-0a41452a'} />
                <SocialMediaButtonComponent
                    imageSrc={githubSvg} 
                    redirectUrl={'https://github.com/TaybrownOB196/'} />
                <SocialMediaButtonComponent
                    imageSrc={fiverrSvg}
                    redirectUrl={'https://www.fiverr.com/snitch196?public_mode=true'} />
                <SocialMediaButtonComponent
                    imageSrc={facebookSvg} 
                    redirectUrl={'https://www.facebook.com/Taylor.Delbert.Brown/'} />

            </div>
        );
    }
}

export default SocialMediaTrayComponent;