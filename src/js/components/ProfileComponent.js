import React from 'react';
import profile_img from './../../jpg/20220716_113150.jpg'
import resume from './../../staticfiles/TaybrownResume.pdf';
import SocialMediaTray from './banners/SocialMediaTray';

function ProfileComponent() {
    return (
        <div id='left-container'>
            <div className='height-offset center-content'>
                <header id='header-container'>
                    <h2>Taylor Brown</h2>
                    <h5>Full Stack .NET Engineer</h5>
                </header>

                <div id='profileImage-container'>
                    <div id='profileImage-wrapper'>
                        <img id='profileImage' src={profile_img}></img>
                    </div>

                    <div id='profileImageBubble'></div>
                </div>
                
                <div id='socialMediaTray-container' className='profile-content-container top-gap-16'>
                    <SocialMediaTray />
                </div>

                <div id='intro-container' className='profile-content-container top-gap-16'>
                    <p style={{textAlign:'-webkit-center'}}>Hello World!</p> 
                    <p style={{textAlign:'-webkit-center'}}>I develop web applications professionally and design video games as a hobby.</p>
                </div>

                <div id='resumeContainer' className='profile-content-container top-gap-16'>
                    <h3>
                        <a href={resume} download='TaylorBrownResume' >R&#233;sum&#233;</a>
                    </h3>
                </div>
            </div>        
        </div>
    );
}

export default ProfileComponent;