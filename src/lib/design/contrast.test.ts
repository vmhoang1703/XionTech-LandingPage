import { describe, it, expect } from 'vitest';
import { contrastRatio, readThemeColors } from './contrast';

describe('contrastRatio', () => {
  it('calculates navy on paper as 11.86', () => {
    const navy = '#163663';
    const paper = '#FDFDFE';
    const ratio = contrastRatio(navy, paper);
    expect(ratio).toBeCloseTo(11.86, 2);
  });

  it('calculates white on amber as 1.64', () => {
    const white = '#FFFFFF';
    const amber = '#FFC000';
    const ratio = contrastRatio(white, amber);
    expect(ratio).toBeCloseTo(1.64, 2);
  });

  it('handles uppercase hex colors', () => {
    const ratio = contrastRatio('#163663', '#FDFDFE');
    expect(ratio).toBeCloseTo(11.86, 2);
  });

  it('handles lowercase hex colors', () => {
    const ratio = contrastRatio('#163663', '#fdfdfe');
    expect(ratio).toBeCloseTo(11.86, 2);
  });
});

describe('readThemeColors', () => {
  it('parses @theme colors from CSS', () => {
    const css = `
      @theme {
        --color-navy: #163663;
        --color-paper: #FDFDFE;
      }
    `;
    const colors = readThemeColors(css);
    expect(colors).toEqual({
      navy: '#163663',
      paper: '#FDFDFE',
    });
  });

  it('handles multiple theme blocks', () => {
    const css = `
      @theme {
        --color-navy: #163663;
      }
      @theme {
        --color-amber: #FFC000;
      }
    `;
    const colors = readThemeColors(css);
    expect(colors).toHaveProperty('navy', '#163663');
    expect(colors).toHaveProperty('amber', '#FFC000');
  });

  it('returns empty object for CSS with no @theme', () => {
    const css = 'body { color: red; }';
    const colors = readThemeColors(css);
    expect(colors).toEqual({});
  });
});
