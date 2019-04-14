const Tone = require("tone");
const Midi = require("@tonejs/midi/build/Midi");

const synths = [];

const mySynth = {
  Synth: Tone.Synth,
  MonoSynth: Tone.MonoSynth,
  FMSynth: Tone.FMSynth,
  AMSynth: Tone.AMSynth,
  PolySynth: Tone.PolySynth
};

const getSynthNames = () => Object.keys(mySynth);

const parse = (file, cb) => {
  const reader = new FileReader();
  reader.onload = e => {
    const midi = new Midi(e.target.result);
    cb(midi);
  };
  reader.readAsArrayBuffer(file);
};

const play = (midiTacks, loadStartCb, loadEndCb) => {
  if (loadStartCb) loadStartCb();
  if (midiTacks) {
    const now = Tone.now();
    midiTacks.forEach(track => {
      const synth = new mySynth[track.synthName]().toMaster();
      synths.push(synth);
      track.notes.forEach(note => {
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now,
          note.velocity
        );
      });
    });
  }
  if (loadEndCb) loadEndCb();
};

const stop = () => {
  while (synths.length) {
    const synth = synths.shift();
    synth.dispose();
  }
};

export default { parse, play, stop, getSynthNames };
