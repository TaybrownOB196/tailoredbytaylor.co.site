import React from 'react';

// export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
export default function SocialMediaButton(props) {
    return (
        <input
            type='image'
            className='square socailMediaButton'
            src={props.imageSrc}
            onClick={() => window.open(props.redirectUrl, '_blank')} 
        />
    );
}