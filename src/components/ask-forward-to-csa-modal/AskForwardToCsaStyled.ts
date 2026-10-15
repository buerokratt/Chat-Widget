import styled from "styled-components";

export const AskForwardToCsaModalStyles = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overflow-wrap: anywhere;

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 30px;
        height: 100%;
        box-sizing: border-box;
        padding-bottom: 0.5rem;
        text-align: center;
    }

    .header {
        padding: 0 10px;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .buttons {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
    
    .h3-style {
        display: block;
        font-size: 1.17em;
        margin-top: 1em;
        margin-bottom: 1em;
        margin-left: 0;
        margin-right: 0;
        font-weight: bold;
    }
`;
