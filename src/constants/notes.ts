import { t } from 'elysia';

// Note to MIDI note number
// C0 is equal to 12.
export const Notes = Object.freeze({
  'C-1': 0,
  'Cs-1': 1,
  'Db-1': 1,
  'D-1': 2,
  'Ds-1': 3,
  'Eb-1': 3,
  'E-1': 4,
  'F-1': 5,
  'Fs-1': 6,
  'Gb-1': 6,
  'G-1': 7,
  'Gs-1': 8,
  'Ab-1': 8,
  'A-1': 9,
  'As-1': 10,
  'Bb-1': 10,
  'B-1': 11,

  // C0
  C0: 12,
  Cs0: 13,
  Db0: 13,
  D0: 14,
  Ds0: 15,
  Eb0: 15,
  E0: 16,
  F0: 17,
  Fs0: 18,
  Gb0: 18,
  G0: 19,
  Gs0: 20,
  Ab0: 20,
  A0: 21,
  As0: 22,
  Bb0: 22,
  B0: 23,

  // C1
  C1: 24,
  Cs1: 25,
  Db1: 25,
  D1: 26,
  Ds1: 27,
  Eb1: 27,
  E1: 28,
  F1: 29,
  Fs1: 30,
  Gb1: 30,
  G1: 31,
  Gs1: 32,
  Ab1: 32,
  A1: 33,
  As1: 34,
  Bb1: 34,
  B1: 35,

  // C2
  C2: 36,
  Cs2: 37,
  Db2: 37,
  D2: 38,
  Ds2: 39,
  Eb2: 39,
  E2: 40,
  F2: 41,
  Fs2: 42,
  Gb2: 42,
  G2: 43,
  Gs2: 44,
  Ab2: 44,
  A2: 45,
  As2: 46,
  Bb2: 46,
  B2: 47,

  // C3
  C3: 48,
  Cs3: 49,
  Db3: 49,
  D3: 50,
  Ds3: 51,
  Eb3: 51,
  E3: 52,
  F3: 53,
  Fs3: 54,
  Gb3: 54,
  G3: 55,
  Gs3: 56,
  Ab3: 56,
  A3: 57,
  As3: 58,
  Bb3: 58,
  B3: 59,

  // C4
  C4: 60,
  Cs4: 61,
  Db4: 61,
  D4: 62,
  Ds4: 63,
  Eb4: 63,
  E4: 64,
  F4: 65,
  Fs4: 66,
  Gb4: 66,
  G4: 67,
  Gs4: 68,
  Ab4: 68,
  A4: 69,
  As4: 70,
  Bb4: 70,
  B4: 71,

  // C5
  C5: 72,
  Cs5: 73,
  Db5: 73,
  D5: 74,
  Ds5: 75,
  Eb5: 75,
  E5: 76,
  F5: 77,
  Fs5: 78,
  Gb5: 78,
  G5: 79,
  Gs5: 80,
  Ab5: 80,
  A5: 81,
  As5: 82,
  Bb5: 82,
  B5: 83,

  // C6
  C6: 84,
  Cs6: 85,
  Db6: 85,
  D6: 86,
  Ds6: 87,
  Eb6: 87,
  E6: 88,
  F6: 89,
  Fs6: 90,
  Gb6: 90,
  G6: 91,
  Gs6: 92,
  Ab6: 92,
  A6: 93,
  As6: 94,
  Bb6: 94,
  B6: 95,

  // C7
  C7: 96,
  Cs7: 97,
  Db7: 97,
  D7: 98,
  Ds7: 99,
  Eb7: 99,
  E7: 100,
  F7: 101,
  Fs7: 102,
  Gb7: 102,
  G7: 103,
  Gs7: 104,
  Ab7: 104,
  A7: 105,
  As7: 106,
  Bb7: 106,
  B7: 107,

  // C8
  C8: 108,
  Cs8: 109,
  Db8: 109,
  D8: 110,
  Ds8: 111,
  Eb8: 111,
  E8: 112,
  F8: 113,
  Fs8: 114,
  Gb8: 114,
  G8: 115,
  Gs8: 116,
  Ab8: 116,
  A8: 117,
  As8: 118,
  Bb8: 118,
  B8: 119,

  // C9
  C9: 120,
  Cs9: 121,
  Db9: 121,
  D9: 122,
  Ds9: 123,
  Eb9: 123,
  E9: 124,
  F9: 125,
  Fs9: 126,
  Gb9: 126,
  G9: 127,
});

export const NotesSchema = t.Enum(Notes);

export function getOctaveByNote(note: number) {
  return Math.floor(note / 12) - 1;
}

export function getNoteOffset(offset: number) {
  switch (offset) {
    case 0:
      return ['C'];
    case 1:
      return ['Cs', 'Db'];
    case 2:
      return ['D'];
    case 3:
      return ['Ds', 'Eb'];
    case 4:
      return ['E'];
    case 5:
      return ['F'];
    case 6:
      return ['Fs', 'Gb'];
    case 7:
      return ['G'];
    case 8:
      return ['Gs', 'Ab'];
    case 9:
      return ['A'];
    case 10:
      return ['As', 'Bb'];
    case 11:
      return ['B'];
    default:
      throw new Error(`Invalid note offset: ${offset}`);
  }
}

export function getNoteName(note: number) {
  switch (note % 12) {
    case 0:
      return {
        main: 'C',
        sharp: null,
        flat: null,
      };
    case 1:
      return {
        main: 'C#',
        sharp: 'C#',
        flat: 'D♭',
      };
    case 2:
      return {
        main: 'D',
        sharp: null,
        flat: null,
      };
    case 3:
      return {
        main: 'D#',
        sharp: 'D#',
        flat: 'E♭',
      };
    case 4:
      return {
        main: 'E',
        sharp: null,
        flat: null,
      };
    case 5:
      return {
        main: 'F',
        sharp: null,
        flat: null,
      };
    case 6:
      return {
        main: 'F#',
        sharp: 'F#',
        flat: 'G♭',
      };
    case 7:
      return {
        main: 'G',
        sharp: null,
        flat: null,
      };
    case 8:
      return {
        main: 'G#',
        sharp: 'G#',
        flat: 'A♭',
      };
    case 9:
      return {
        main: 'A',
        sharp: null,
        flat: null,
      };
    case 10:
      return {
        main: 'A#',
        sharp: 'A#',
        flat: 'B♭',
      };
    case 11:
      return {
        main: 'B',
        sharp: null,
        flat: null,
      };
    default:
      throw new Error(`Invalid note: ${note}`);
  }
}

export function getNoteKey(note: number, preferFlat = false) {
  if (note < 0 || note > 127) {
    throw new Error(`Invalid note: ${note}`);
  }

  const octave = getOctaveByNote(note);
  const offset = getNoteOffset(note % 12);

  if (preferFlat && offset.length > 1) {
    return `${offset[1]}${octave}`;
  }

  return `${offset[0]}${octave}`;
}

export const MidiNoteSchema = t.Number({
  minimum: 0,
  maximum: 127,
});
