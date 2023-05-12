// import { AudioClip, AudioController } from '../../../lib/gaming/audio/audio';
// this.audioCtrl = new AudioController(document.getElementById('SITAudio_0'));
// this.audioCtrl.setClip('swerve', new AudioClip(.5, .6));
// this.audioCtrl.playClip('swerve')
// .catch(err => console.log(err));

class AudioClip {
    constructor(start, stop) {
        this.start = start;
        this.stop = stop;
    }
}

class AudioController {
    constructor(audioElement) {
        if (!audioElement)
        throw Error(`invalid audio element ${audioElement} passed`);
        console.log(audioElement)
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.audio = audioElement;
        this.audioClips = {};
        this._isPlaying = false;
        this.currentClip = null;
    }

    handleTimeUpdate() {
        if (this.audio.currentTime > this.currentClip.stop) {
            this.stop();
        }
    }

    setClip(name, audioClip) {
        this.audioClips[name] = audioClip;
    }

    stop() {
        this.audio.pause();
        this._isPlaying = false;
        this.currentClip = null;
        this.audio.removeEventListener('timeupdate', this.handleTimeUpdate, false);
    }

    playClip(name) {
        this.stop();

        this._isPlaying = true;
        this.currentClip = this.audioClips[name];
        this.audio.currentTime = this.currentClip.start;
        this.audio.addEventListener('timeupdate', this.handleTimeUpdate, false);
        return this.audio.play();
    }
}

export {
    AudioController, AudioClip
};