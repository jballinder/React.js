class Spotify {
  constructor() {
      this.token = null;
      this.expiresIn = null;
      this.username = null;
      this.playlistId = null;
      this.snapshotId = null;
      this._clientId = 'a85c9add6e4e4cd885eb361af138cc6c';
      this._localUri = 'http://localhost:3000';
  }
  getAccessToken() {
      if (this.token) {
          return this.token;
      } else if (window.location.href.match(/access_token=([^&]*)/)) {
          let accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
          this.token = accessToken;
          this.expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
          window.setTimeout(() => accessToken = '', this.expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return accessToken;
      } else {
          window.location.href =`https://accounts.spotify.com/authorize?client_id=${this._clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${this._localUri}`;
          let accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
          this.token = accessToken;
          this.expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
          window.setTimeout(() => accessToken = '', this.expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return accessToken;
      }
  }

  search(term) {
      this.token = this.getAccessToken();

      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
          {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${this.token}`
              }
          })
          .then(response => response.json())
          .then(jsonResponse => {
              if (jsonResponse.tracks) {
                  return jsonResponse.tracks.items.map(track => {
                      return {
                          id: track.id,
                          name: track.name,
                          artist: track.artists[0].name,
                          album: track.album.name,
                          uri: track.uri
                      }
                  });
              }
          });
  }

  getUsername() {
      this.token = this.getAccessToken();
      return fetch(`https://api.spotify.com/v1/me`,
          {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${this.token}`
              }
          })
          .then(response => response.json())
          .then(jsonResponse => {
              console.log(jsonResponse.id);
              const username = jsonResponse.id;
              return username;
          });

  }

  createPlaylist(name) {
      this.token = this.getAccessToken();
      return fetch(`https://api.spotify.com/v1/users/${this.username}/playlists`,
          {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${this.token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({name: name})
          })
          .then(response => response.json())
          .then(jsonResponse => {
              console.log(jsonResponse.id);
              const playlistId = jsonResponse.id;
              return playlistId;
          });
  }

  savePlaylist(name, trackUris) {
      if (name && trackUris) {
          this.token = this.getAccessToken();
          this.getUsername()
              .then(id => {
                  this.username = id;
                  this.createPlaylist(name)
                      .then(id => {
                          this.playlistId = id;
                          return fetch(`https://api.spotify.com/v1/users/${this.username}/playlists/${this.playlistId}/tracks?uris=${trackUris}`,
                              {
                                  method: 'POST',
                                  headers: {
                                      Authorization: `Bearer ${this.token}`,
                                      'Content-Type': 'application/json'
                                  }
                              })
                              .then(response => response.json())
                              .then(jsonResponse => jsonResponse);
                      });
              });


          console.log(this.username);
          console.log(this.playlistId);

      }
  }

}

export default new Spotify();