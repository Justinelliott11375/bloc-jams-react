import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import '../Album.css';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      mouseIsOver: false,
      currentVolume: 0.8,
      hoveredSong: null
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = 0.8
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true});
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false});
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange)
  }

  componentWillUnmount() {
    this.audioElement.pause();
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);

  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song});
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if ( !isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  formatTime(songLength) {
    var minutes = Math.floor(songLength / 60);
    var seconds = Math.floor(songLength % 60);
    if (seconds < 10){
      var formattedTime = minutes + ":0" + seconds;
    }
    else {
      formattedTime = minutes + ":" + seconds;
    }
    if (isNaN(seconds)) {
      return "-:--";
    }
    else {
    return formattedTime;
    }
  }

  handleVolumeChange(e){
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume });
  }

  handleMouseEnter(song){
    this.setState({mouseIsOver: true});
    this.setState({hoveredSong: song});
  }

  handleMouseOut(){
    this.setState({mouseIsOver: false});
    this.setState({hoveredSong: null})
  }

  render () {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt="this.state.album.title"/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="realse-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          handleMouseEnter={(song) => this.handleMouseEnter(song)}
          handleMouseOut={() => this.handleMouseOut()}
          formatTime={(songLength) => this.formatTime(songLength)}
        />
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {this.state.album.songs.map( (song, index) =>
                <tr className="song" key={index} >
                  <td className="song-actions">
                    <button id="songNumberButtons" onClick={() => this.handleSongClick(song)} onMouseOver={() => this.handleMouseEnter(song)} onMouseOut={() => this.handleMouseOut()}>
                      {this.state.hoveredSong === song && this.state.currentSong !== song ? <span className="ion-play"></span> :this.state.currentSong === song ? <span className={this.state.isPlaying !== true ? "ion-play" : "ion-pause"}></span> : <span>{index + 1}</span>}
                    </button>
                  </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.formatTime(song.duration)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;
