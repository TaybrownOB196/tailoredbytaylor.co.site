import React from 'react';

import profile_img from './../../jpg/20220716_113150.jpg'
import SocialMediaTray from './banners/SocialMediaTray';

function ProfileComponent() {
    return (
        <div id='profileComponent'>
            <header id='header-container'>
                <h2>Taylor Brown</h2>
                <h4>Software Developer</h4>
            </header>

            <div id='profileImage-container'>
                <div id='profileImage-wrapper'>
                    <img id='profileImage' src={profile_img}></img>
                </div>

                <div id='profileImageBubble'></div>
            </div>
            
            <div id='socialMediaTray-container'>
                <SocialMediaTray />
            </div>

            <div id='intro-container'>
                <p>Hello, World! My name is Taylor Brown and I am a software developer.</p>
            </div>
        
        </div>
    );
}

export default ProfileComponent;