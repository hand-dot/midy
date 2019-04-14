import React, { Component } from "react";
import { saveAs } from "file-saver";
import "./App.css";
import midy from "../../index";

const synthNames = midy.getSynthNames();

const setTrackName = track => ({
  name: track.name,
  synthName: synthNames[0],
  option: {}
});

const exclusionNonNotes = track => track.notes && track.notes.length > 0;

const loadStartCb = () => console.log("loadStartCb");
const loadEndCb = () => console.log("loadEndCb");

class App extends Component {
  state = {
    playing: false,
    tracks: []
  };
  midi = null;

  changeTrackSynth(synthName, index) {
    const tracks = Object.assign([], this.state.tracks);
    tracks[index].synthName = synthName;
    this.setState({ tracks });
  }

  parse(e) {
    const files = e.target.files;
    if (files.length < 0) return;
    const file = files[0];
    this.midi = null;
    midy.parse(file, midi => {
      const tracks = midi.tracks.filter(exclusionNonNotes).map(setTrackName);
      this.setState({ tracks });
      this.midi = midi;
    });
  }

  play() {
    if (!this.midi) return;
    midy.play(
      this.midi.tracks.filter(exclusionNonNotes).map((midiTrack, i) => ({
        ...midiTrack,
        synthName: this.state.tracks[i].synthName
      })),
      loadStartCb,
      loadEndCb
    );
    this.setState({ playing: true });
  }

  stop() {
    midy.stop();
    this.setState({ playing: false });
  }

  save() {
    console.log(this.midi);
    console.log(this.state.tracks);
    if (!this.midi) return;
    const midi = JSON.parse(JSON.stringify(this.midi));
    const midiTracks = midi.tracks.filter(exclusionNonNotes);
    midiTracks.forEach((track, index) => {
      track.midy = {
        synthName: this.state.tracks[index].synthName,
        option: this.state.tracks[index].option
      };
    });
    console.log(midiTracks);
    console.log(midi);
    midi.tracks = midiTracks;
    const blob = new Blob([JSON.stringify(midi)], {
      type: "application/json"
    });
    saveAs(blob, "midy.json");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>midy</p>
          <div style={{ textAlign: "left" }}>
            {this.state.tracks.map((track, trackIndex) => (
              <li
                key={track.name}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span>{track.name}</span>/
                <select
                  onChange={e =>
                    this.changeTrackSynth(e.target.value, trackIndex)
                  }
                >
                  {synthNames.map(synthName => (
                    <option key={synthName} value={synthName}>
                      {synthName}
                    </option>
                  ))}
                </select>
                /<button>detail</button>/<button>x</button>
              </li>
            ))}
          </div>
          <input
            type="file"
            accept="audio/midi"
            onChange={this.parse.bind(this)}
          />
          <button
            onClick={
              this.state.playing ? this.stop.bind(this) : this.play.bind(this)
            }
          >
            {this.state.playing ? "stop" : "play"}
          </button>
          <button onClick={this.save.bind(this)}>save</button>
        </header>
      </div>
    );
  }
}

export default App;
