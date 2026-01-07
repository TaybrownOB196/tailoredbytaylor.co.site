import About from "./partials/About.jsx";
import Profile from "./partials/Profile.jsx";

import './styles/App.scss';
import './styles/App.media.scss';

export default function App() {
    return (
    <>
      <div id='left-container'>

        <Profile />
      </div>

      <div id='right-container'>

        <About />
      </div>
    </>
  );
}