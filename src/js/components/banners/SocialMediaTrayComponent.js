import React from 'react';
import SocialMediaButtonComponent from '../buttons/SocialMediaButtonComponent';
import facebookSvg from './../../../svg/5365678_fb_facebook_facebook_logo_icon_black.svg'
import linkedinSvg from './../../../svg/5296501_linkedin_network_linkedin_logo_icon.svg'
import githubSvg from './../../../svg/github_black.svg'

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
                    imageSrc={facebookSvg} 
                    redirectUrl={'https://www.facebook.com/Taylor.Delbert.Brown/'} />

            </div>
        );
    }
}

export default SocialMediaTrayComponent;