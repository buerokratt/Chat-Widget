import styled from "styled-components";
import {colors, fontChat, fontChatBold} from "../../styling/style_settings";

export const ChatStyles = styled.div<{isFullScreen?: boolean}>`
    .chatWrapper {
        z-index: 9999;
        position: fixed !important;
        margin: ${props => props.isFullScreen ? '0' : '1em'};
        right: 0;
        bottom: 0;
        top: ${props => props.isFullScreen ? '0' : 'auto'};
        left: ${props => props.isFullScreen ? '0' : 'auto'};
        width: ${props => props.isFullScreen ? '100vw' : 'auto'};
        height: ${props => props.isFullScreen ? '100vh' : 'auto'};
        transition: none !important;
    }

    .chat-resize-handle {
        position: absolute !important;
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: nwse-resize;
        z-index: 100;
    }

    .sub-title {
      flex-shrink: 0;
      width: 100%;
      background-color: #F0F1F2;
      color: #003cff;
      padding: 5px 0px;
      font-size: 22px;
      text-align: center;
      font-family: "Aino Headline";
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .emergency-notice {
      width: 100%;
      background-color: #ffffff;
      padding: 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #e5e5e5;
      box-shadow: 0 0.2px 0px rgba(0, 0, 0, 0.1);
    }

    .emergency-notice-icon {
      width: 1.4em;
      height: 1.4em;
      margin-left: 12px;
      background-color: #003cff;
      border-radius: 50%;
      color: #ffffff;
      font-size: 2em;
      font-weight: bold;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .emergency-notice-text {
      flex: 1;
      color: #333333;
      font-size: 1.2em;
      text-align: left;
      font-family: ${fontChat};
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .chat-resize-handle-top-left {
        top: 11px;
        left: 10px;
    }

    @media screen and (max-width: 480px) {
        .chatWrapper {
            display: flex;
            margin: 0.5em;
            top: 0;
            left: 0;
            transition: none !important;
        }
    }

    .chat {
        display: flex;
        flex-direction: column;
        font-family: ${fontChat};
        background: #ffffff;
        box-shadow: 0 4px 4px ${colors.gray};
        height: ${props => props.isFullScreen ? '100vh' : '100%'};
        width: ${props => props.isFullScreen ? '100vw' : '100%'};
        border-radius: ${props => props.isFullScreen ? '0' : '8px'};
        font-size: 14px;
        line-height: 1.5;
        transition: none !important;

        b, strong {
            font-family: ${fontChatBold};
        }
    }

    .authenticated {
        box-shadow: 0 0 8px 2px #0078ff;
    }

    @media screen and (max-width: 480px) {
        .chat {
            position: fixed;
            bottom: 0;
            right: 0;
            height: 100dvh;
            width: 100%;
        }
    }

    @media screen and (max-height: 480px) {
        .chatWrapper {
            display: flex;
            margin: 0;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
        }
        .chat {
            position: fixed;
            top: 0;
            left: 0;
            height: 100dvh;
            width: 100%;
        }
    }
`
