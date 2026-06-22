import styled from "styled-components";

export const LoadingAnimationStyles = styled.div`
    .bouncing-loader {
        display: flex;
        justify-content: center;
        margin: 0.65em 0em 0.3em 0.2em;
    }

    .bouncing-loader > div {
        width: 4.5px;
        height: 4.5px;
        margin: 2px 4px;
        border-radius: 50%;
        background-color: #ffffff;
        opacity: 1;
        animation: bouncing-loader 0.6s infinite alternate;
    }

    @keyframes bouncing-loader {
        to {
            opacity: 0.1;
            transform: translateY(-5px);
        }
    }

    .bouncing-loader > div:nth-child(2) {
        animation-delay: 0.2s;
    }

    .bouncing-loader > div:nth-child(3) {
        animation-delay: 0.4s;
    }

    .processing-notice {
        margin: 0.2em;
        background: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer-text 2s linear infinite;
    }

    @keyframes shimmer-text {
        from { background-position: 200% center; }
        to { background-position: -200% center; }
    }

`
