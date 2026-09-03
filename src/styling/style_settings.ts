import {css} from 'styled-components';

export const colors = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    black: 'var(--color-black)',
    mustakivi: 'var(--color-mustakivi)',
    gray: 'var(--color-gray)',
    hellamaa: 'var(--color-hellamaa)',
    majakivi: 'var(--color-majakivi)',
    placeholderGray: 'var(--color-placeholder-gray)',
    inputBorderGray: 'var(--color-input-border-gray)',
    backgroundGray: 'var(--color-background-gray)',
    white: 'var(--color-white)',
    focusLight: 'var(--color-focus-light)',
    focusDark: 'var(--color-focus-dark)',
    scrollbarNormal: 'var(--color-scrollbar-normal)',
    scrollbarHover: 'var(--color-scrollbar-hover)',
    scrollbarActive: 'var(--color-scrollbar-active)',
    headerBottomBorder: 'var(--color-header-bottom-border)',
    chatSurface: 'var(--color-chat-surface)',
    emergencyNoticeBg: 'var(--color-emergency-notice-bg)',
    emergencyNoticeText: 'var(--color-emergency-notice-text)',
};

export const fontTitle = `'Aino Headline', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
export const fontChat = `'Aino Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
export const fontChatBold = `'Aino Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;


export const textM = css`
    font-family: ${fontTitle};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.mustakivi};
`;

export const textMBold = css`
    ${textM};
    font-family: ${fontChatBold};
    font-weight: 700;
`

export const textS = css`
    font-family: ${fontChat};
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: ${colors.mustakivi};
`;


export const textSBold = css`
    ${textS};
    font-family: ${fontChatBold};
    font-weight: 700;
`;

export const textXS = css`
    font-family: ${fontChat};
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: ${colors.mustakivi};

`;

export const textXSBold = css`
    ${textXS};
    font-family: ${fontChatBold};
    font-weight: 700;
`;

export const buttonS = css`
    ${textXS};
    text-transform: uppercase;
`;

export const context = 16;