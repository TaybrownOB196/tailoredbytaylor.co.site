import React from 'react';
import resume from './../../staticfiles/TaybrownResume.pdf';
import resumeImg from './../../png/TaybrownResume.png';

function Resume() {
    return (
        <div id='resumeContainer'>
            <img src={resumeImg}></img>
            <a href={resume} download='TaylorBrownResume' style={aStyle}>Download</a>
        </div>
    );
}

const aStyle = {
    color: 'yellow'
}

export default Resume;