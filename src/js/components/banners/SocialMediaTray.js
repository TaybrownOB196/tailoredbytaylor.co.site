import React from 'react';
import SocialMediaButton from '../buttons/SocialMediaButton';
import facebookSvg from './../../../svg/5365678_fb_facebook_facebook_logo_icon.svg'
import linkedinSvg from './../../../svg/5296501_linkedin_network_linkedin_logo_icon.svg'

class SocialMediaTray extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='socialMediaTray'>
                <SocialMediaButton
                    imageSrc={linkedinSvg} 
                    redirectUrl={'https://www.linkedin.com/in/taylor-brown-0a41452a'} />
                {/* <SocialMediaButton
                    imageSrc={facebookSvg} 
                    redirectUrl={'https://www.facebook.com/Taylor.Delbert.Brown/'} /> */}

            </div>
        );
    }
}

export default SocialMediaTray;