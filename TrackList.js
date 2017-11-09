import React from 'react';
import Track from '../Track/Track';
import styled from 'styled-components';

const Tracks = styled.div`
    width: 100%;
`;



class TrackList extends React.Component {
  render() {
      return (
          <Tracks>
              {this.props.tracks.map(track => {
                  return <Track key={track.id}
                                track={track}
                                onAdd={this.props.onAdd}
                                onRemove={this.props.onRemove}
                                isRemoval={this.props.isRemoval}/>;
              })}
          </Tracks>
      );
  }
}


export default TrackList;
