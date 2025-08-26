import { uniq } from 'lodash';
import { describe, it, expect } from 'vitest';
import { getNoteKey, getNoteOffset, getOctaveByNote, Notes } from './notes';

describe('NoteSchema', () => {
  it('should get the correct octave', () => {
    expect(getOctaveByNote(0)).toBe(-1);
    expect(getOctaveByNote(12)).toBe(0);
    expect(getOctaveByNote(13)).toBe(0);
    expect(getOctaveByNote(24)).toBe(1);
    expect(getOctaveByNote(35)).toBe(1);
    expect(getOctaveByNote(36)).toBe(2);
    expect(getOctaveByNote(47)).toBe(2);
    expect(getOctaveByNote(48)).toBe(3);
    expect(getOctaveByNote(59)).toBe(3);
    expect(getOctaveByNote(60)).toBe(4);
    expect(getOctaveByNote(71)).toBe(4);
    expect(getOctaveByNote(72)).toBe(5);
    expect(getOctaveByNote(83)).toBe(5);
    expect(getOctaveByNote(84)).toBe(6);
    expect(getOctaveByNote(95)).toBe(6);
    expect(getOctaveByNote(96)).toBe(7);
    expect(getOctaveByNote(107)).toBe(7);
    expect(getOctaveByNote(108)).toBe(8);
    expect(getOctaveByNote(119)).toBe(8);
    expect(getOctaveByNote(120)).toBe(9);
    expect(getOctaveByNote(127)).toBe(9);
  });

  it('should get the correct offset', () => {
    expect(getNoteOffset(0)).toEqual(['C']);
    expect(getNoteOffset(1)).toEqual(['Cs', 'Db']);
    expect(getNoteOffset(2)).toEqual(['D']);
    expect(getNoteOffset(3)).toEqual(['Ds', 'Eb']);
    expect(getNoteOffset(4)).toEqual(['E']);
    expect(getNoteOffset(5)).toEqual(['F']);
    expect(getNoteOffset(6)).toEqual(['Fs', 'Gb']);
    expect(getNoteOffset(7)).toEqual(['G']);
    expect(getNoteOffset(8)).toEqual(['Gs', 'Ab']);
    expect(getNoteOffset(9)).toEqual(['A']);
    expect(getNoteOffset(10)).toEqual(['As', 'Bb']);
    expect(getNoteOffset(11)).toEqual(['B']);
  });

  it('should throw when an offset is out of range', () => {
    expect(() => getNoteOffset(12)).toThrow();
    expect(() => getNoteOffset(-1)).toThrow();
  });

  it('should get the correct key', () => {
    expect(getNoteKey(0)).toBe('C-1');
    expect(getNoteKey(1)).toBe('Cs-1');
    expect(getNoteKey(1, true)).toBe('Db-1');
    expect(getNoteKey(2)).toBe('D-1');
    expect(getNoteKey(127)).toBe('G9');
  });

  it('should throw when the note is out of range', () => {
    expect(() => getNoteKey(128)).toThrow();
    expect(() => getNoteKey(-1)).toThrow();
  });

  it('should have all notes', () => {
    const notes = Array.from({ length: 128 }, (_, i) => i);

    for (const note of notes) {
      const key = getNoteKey(note);
      expect(Notes[key as keyof typeof Notes]).toBe(note);
    }

    // Using uniq to ensure no duplicates (as sharps and flats are the same note)
    expect(uniq(Object.values(Notes)).length).toBe(128);
  });
});
