import facebookSvg from '../assets/5365678_fb_facebook_facebook_logo_icon.svg'
import linkedinSvg from '../assets/5296501_linkedin_network_linkedin_logo_icon.svg'
import leetcodeSvg from '../assets/leetcode.svg'
import githubSvg from '../assets/github.svg'

const socials = [
  {
    'svg': linkedinSvg,
    'url': 'https://www.linkedin.com/in/taylor-brown-0a41452a'
  },
  {
    'svg': githubSvg,
    'url': 'https://github.com/TaybrownOB196/'
  },
  {
    'svg': leetcodeSvg,
    'url': 'https://leetcode.com/u/taybrownob196/'
  },
  // {
  //   'svg': facebookSvg,
  //   'url': 'https://www.facebook.com/Taylor.Delbert.Brown/'
  // },
]

export default function SocialMediaTray() {
  return (
    <div className='social-media-tray'>
      {socials.map((social, idx) => {
        return <input
          key={idx}
          type='image'
          src={social.svg}
          onClick={() => window.open(social.url, '_blank')} 
        />
      })}
    </div>
  );
}