import Tone from "tone";
import Midi from "@tonejs/midi/build/Midi";

const synths = [];

const mySynth = {
  NoiseSynth: new Tone.NoiseSynth(),
  Synth: new Tone.Synth(),
  AMSynth: new Tone.AMSynth(),
  DuoSynth: new Tone.DuoSynth(),
  FMSynth: new Tone.FMSynth(),
  MonoSynth: new Tone.MonoSynth(),
  PluckSynth: new Tone.PluckSynth(),
  MetalSynth: new Tone.MetalSynth(),
  PolySynth: new Tone.PolySynth(),
  Monophonic: new Tone.Monophonic(),
  MembraneSynth: new Tone.MembraneSynth()
};

const synthGen = (name = "PolySynth") => {
  return mySynth[name];
};

const getSynthNameByIndex = index => {
  if (index === 0) {
    return "NoiseSynth";
  } else if (index === 1) {
    return "Synth";
  } else if (index === 2) {
    return "AMSynth";
  } else if (index === 3) {
    return "DuoSynth";
  } else if (index === 4) {
    return "FMSynth";
  } else if (index === 5) {
    return "NoiseSynth";
  } else if (index === 6) {
    return "PluckSynth";
  } else if (index === 7) {
    return "MetalSynth";
  } else if (index === 8) {
    return "PolySynth";
  } else if (index === 9) {
    return "Monophonic";
  } else if (index === 10) {
    return "MembraneSynth";
  } else {
    return "PolySynth";
  }
};

export const parseFile = (file, cb) => {
  const reader = new FileReader();
  reader.onload = e => {
    const midi = new Midi(e.target.result);
    cb(midi);
  };
  reader.readAsArrayBuffer(file);
};

export const play = midi => {
  if (midi) {
    const now = Tone.now() + 0.5;
    midi.tracks.forEach((track, index) => {
      //create a synth for each track
      const synthName = getSynthNameByIndex(index);
      console.log("trackNo", index);
      console.log("track.name", track.name);
      console.log("synthName", synthName);
      const synth = synthGen(synthName).toMaster();
      synths.push(synth);
      //schedule all of the events
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
};

export const stop = () => {
  while (synths.length) {
    const synth = synths.shift();
    synth.dispose();
  }
};
