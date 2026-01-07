import SocialMediaTray from '../components/SocialMediaTray.jsx';
import PictureBubble from '../components/PictureBubble.jsx';

import colors from '../styles/colors.module.scss';

export default function Profile() {
  return (
    <>
      <header id='head'>
        <h2>Taylor Brown</h2>
        <h5>Full Stack .NET Engineer</h5>
      </header>

      <div id='bust' style={{marginBottom: '8px'}}>
        <PictureBubble
          imgSrc='src/assets/20220716_113150.jpg'
          bgColor={colors.shade_3}
          dims={{x: '200px', y: '200px'}}
          />
      </div>
        
      <div id='socials'>
        <SocialMediaTray />
      </div>

      <div id='intro' style={{margin: '0px 8px'}}>
        <h4>Hello World!</h4> 
        <p style={{textAlign:'-webkit-center'}}>I develop web applications professionally and design video games as a hobbyist</p>
        <h5 style={{color:'gold'}}>Check out my</h5>
      </div>

      <div id='resume'>
        <h3>
          <a href='src/assets/TaybrownResume.pdf' download='TaylorBrownResume'>R&#233;sum&#233;</a>
        </h3>
      </div>
    </>        
  );
}