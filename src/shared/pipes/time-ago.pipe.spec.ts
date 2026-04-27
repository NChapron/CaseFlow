import { describe, it, expect, beforeEach } from 'vitest';
import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('should return "just now" for dates less than 60 seconds ago', () => {
    const date = new Date(Date.now() - 30 * 1000);
    expect(pipe.transform(date)).toBe('just now');
  });

  it('should return minutes for dates less than 60 minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(date)).toBe('5 minutes ago');
  });

  it('should return "1 minute ago" for singular', () => {
    const date = new Date(Date.now() - 1 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 minute ago');
  });

  it('should return hours for dates less than 24 hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('3 hours ago');
  });

  it('should return "1 hour ago" for singular', () => {
    const date = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 hour ago');
  });

  it('should return days for dates less than 30 days ago', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('3 days ago');
  });

  it('should return "1 day ago" for singular', () => {
    const date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 day ago');
  });

  it('should return "over a month ago" for dates older than 30 days', () => {
    const date = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('over a month ago');
  });
});
