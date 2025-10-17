import React from 'react';
import resume from './../../../staticfiles/TaybrownResume_.pdf';
import resumeImg from './../../../png/TaybrownResume.png';

function Resume() {
    return (
        <div id='resumeContainer'>
            <a href={resume} download='TaylorBrownResume' style={aStyle}>Download</a>
        </div>
    );
}

const aStyle = {
    color: 'yellow'
}

export default Resume;