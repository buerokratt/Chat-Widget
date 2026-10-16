import { chatActiveMinutes } from './duration-utils';

describe('widget/TIM session duration', () => {
  test.each([undefined, null, '', ' ', NaN, Infinity, -1, 0, 'not a duration', '30 minutes', 0.5])('defaults invalid %s to a serializable positive duration', value => {
    expect(JSON.parse(JSON.stringify({ timeout: chatActiveMinutes(value) }))).toEqual({ timeout: 30 });
  });
  test.each([15, '15', ' 15 '])('preserves valid minutes %s', value => expect(chatActiveMinutes(value)).toBe(15));
});
