import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PlayList from'../Playlist./PlayList';
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../Util/Spotify";


class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        playlistTracks: [],
        playlistName: 'New Playlist',
        searchResults: []
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  addTrack(track) {
      let add = true;
      let playlistTracks = this.state.playlistTracks;
      playlistTracks.forEach(playlistTrack => {
          if (track.id === playlistTrack.id) {
              add = false;
          }
      });
      if (add) {
          playlistTracks.push(track);
          this.setState({
              playlistTracks: playlistTracks
          });
      }
  }

  removeTrack(track) {
      let playlistTracks = this.state.playlistTracks;
      let arrayIndex = -1;
      playlistTracks.forEach(function (playlistTrack, index) {
          if (track.id === playlistTrack.id) {
              arrayIndex = index;
          }
      });

      if (arrayIndex > -1) {
          playlistTracks.splice(arrayIndex, 1);
      }

      this.setState({
          playlistTracks: playlistTracks
      });
  }

  updatePlaylistName(name) {
      this.setState({
          playlistName: name
      });
  }

  savePlaylist() {
      let trackUris = [];
      this.state.playlistTracks.forEach(track => {
          trackUris.push(track.uri);
      })
      Spotify.savePlaylist(this.state.playlistName, trackUris)
      this.setState({
          searchResults: [],
          playlistTracks: [],
          playlistName: 'New Playlist'
      })
  }

  search(searchTerm) {
      Spotify.search(searchTerm)
          .then(searchResults => {
              this.setState({
                  searchResults: searchResults
              })
          })
  }

  render() {
      return (
          <div>
              <h1>Ja<span className="highlight">mmm</span>in</h1>
              <div className="App">
                  <SearchBar onSearch={this.search}/>
                  <div className="App-playlist">
                      {SearchResults({onSearch: this.state.searchResults, onAdd: this.addTrack})}
                      <Playlist playlistName={this.state.playlistName}
                                playlistTracks={this.state.playlistTracks}
                                onRemove={this.removeTrack}
                                onNameChange={this.updatePlaylistName}
                                onSave={this.savePlaylist}/>
                  </div>
              </div>
          </div>
      );
  }
}

export default App;
