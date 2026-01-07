import SocialMediaTray from '../components/SocialMediaTray.jsx';

export default function Profile() {
  return (
    <>
      <header id='head'>
        <h2>Taylor Brown</h2>
        <h5>Full Stack .NET Engineer</h5>
      </header>

      <div id='bust' style={{marginBottom: '8px'}}>
        <div className='bubble-image-wrapper'>
          <img className='bubble-image' src='src/assets/20220716_113150.jpg'></img>
        </div>
        <div className='background-bubble'></div>
      </div>
        
      <div id='socials'>
        <SocialMediaTray />
      </div>

      <div id='intro' style={{margin: '0px 8px'}}>
        <p>Hello World!</p> 
        <p style={{textAlign:'-webkit-center'}}>I develop web applications professionally and design video games as a hobbyist</p>
        <p>Check out my</p>
      </div>

      <div id='resume'>
        <h3>
          <a href='src/assets/TaybrownResume.pdf' download='TaylorBrownResume'>R&#233;sum&#233;</a>
        </h3>
      </div>
    </>        
  );
}