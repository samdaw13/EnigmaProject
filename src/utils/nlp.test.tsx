import { computeIoC, nlpConfidence, scoreQuadgrams } from './nlp';

// Gettysburg Address opening, letters only, uppercase — genuine English text
const ENGLISH_TEXT =
  'FOURSCORANDSEVENYEARSAGOOURFOREFATHERSBROUGHTFORTHONTHISCONTINENTANEWNATION' +
  'CONCEIVEDINLIBERTYANDDEDICATEDTOTHEPROPOSITIONTHATALLMENARECREATEDEQUAL';

// Alphabet repeated 10 times — near-uniform letter distribution
const RANDOM_TEXT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(10);

describe('computeIoC', () => {
  it('returns near 0.065 for real English text', () => {
    const ioc = computeIoC(ENGLISH_TEXT);
    expect(ioc).toBeGreaterThan(0.05);
    expect(ioc).toBeLessThan(0.09);
  });

  it('returns less than 0.045 for near-uniform random uppercase text', () => {
    const ioc = computeIoC(RANDOM_TEXT);
    expect(ioc).toBeLessThan(0.045);
  });

  it('returns 0 for single-character input', () => {
    expect(computeIoC('A')).toBe(0);
  });
});

describe('scoreQuadgrams', () => {
  it('scores English text higher than random text', () => {
    const englishScore = scoreQuadgrams(ENGLISH_TEXT);
    const randomScore = scoreQuadgrams(RANDOM_TEXT);
    expect(englishScore).toBeGreaterThan(randomScore);
  });

  it('returns floor value for text shorter than 4 characters', () => {
    expect(scoreQuadgrams('ABC')).toBe(-6.5);
  });

  it('scores known common quadgram-dense text well', () => {
    // TION, THER, THAT are all in the top tier
    const score = scoreQuadgrams('TION');
    expect(score).toBeGreaterThan(-4.0);
  });
});

describe('nlpConfidence', () => {
  it('returns a value between 0 and 100 for English text', () => {
    const confidence = nlpConfidence(ENGLISH_TEXT);
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(100);
  });

  it('returns a value between 0 and 100 for random text', () => {
    const confidence = nlpConfidence(RANDOM_TEXT);
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(100);
  });

  it('scores English text higher than random text', () => {
    const englishConfidence = nlpConfidence(ENGLISH_TEXT);
    const randomConfidence = nlpConfidence(RANDOM_TEXT);
    expect(englishConfidence).toBeGreaterThan(randomConfidence);
  });

  it('returns low confidence for text shorter than 4 characters', () => {
    expect(nlpConfidence('ABC')).toBeLessThan(50);
  });
});
