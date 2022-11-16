import React from "react"
import './TrackSearchResult.css';

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track)
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} class="track" alt="" />
      <div className="ml-3">
        <div className="font-title">{track.title}</div>
        <div className="text-muted font-artist">{track.artist}</div>
      </div>
    </div>
  );
}
