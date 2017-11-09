import React from 'react';
import TrackList from '../TrackList/TrackList.js';
import './SearchResults.css';

function SearchResults({ onSearch, onAdd }) {
  return (
      <div className="SearchResults">
          <h2>Results</h2>
          <TrackList tracks={onSearch}
                     onAdd={onAdd} />
      </div>
  );
}


export default SearchResults;
