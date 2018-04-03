import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums'
class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData };
  }
  render() {
    return (
      <section className="library">
        {
          this.state.albums.map( (album, index) =>
            <Link to={`/album/${album.slug}`} key={index}>
              <img id="album-cover-art" src={album.albumCover} alt={album.title} />
              <div className="libraryAlbumInfo">{album.title}</div>
              <div className="libraryAlbumInfo">{album.artist}</div>
              <div className="libraryAlbumInfo">{album.songs.length} songs</div>
            </Link>
          )
        }
      </section>
    );
  }
}


export default Library;
