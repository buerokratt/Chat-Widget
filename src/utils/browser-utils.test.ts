import { getMobileAppTheme } from './browser-utils';
afterEach(() => { jest.restoreAllMocks(); window.history.replaceState({}, '', '/'); });
it.each(['light', 'dark'])('accepts explicit %s theme inside mobile app', theme => {
  jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('BurokrattApp');
  window.history.replaceState({}, '', `/?theme=${theme}`);
  expect(getMobileAppTheme()).toBe(theme);
});
it('ignores theme query outside mobile app', () => {
  window.history.replaceState({}, '', '/?theme=dark');
  expect(getMobileAppTheme()).toBeNull();
});
it('ignores unknown mobile theme', () => {
  jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('BurokrattApp');
  window.history.replaceState({}, '', '/?theme=unexpected');
  expect(getMobileAppTheme()).toBeNull();
});
