import styled from "styled-components";
import {colors, fontChat} from "../../styling/style_settings";
import {rem} from "../../styling/rem";

export const ResponseErrorNotificationStyles = styled.div`
    .container {
        background: rgba(234, 2, 2, 0.8);
        border-radius: 8px;
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2px;
    }

    .content {
        background-color: #fff;
        box-shadow: 0 2px 2px rgba(167, 169, 171, 0.2);
        display: flex;
        flex-flow: column nowrap;
        left: 50%;
        min-width: 70%;
        padding: 1.5rem;
        position: absolute;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 80%;
        height: 80%;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .title {
        font-family: ${fontChat};
        font-style: normal;
        font-weight: 400;
        font-size: ${rem(20)};
        line-height: 30px;
        text-align: center;
        color: ${colors.mustakivi};
        margin: 0;
    }

    .actions {
        align-items: center;
        flex-flow: row nowrap;
        justify-content: center;
        gap: 10px;
        column-gap: 10px;
        row-gap: 10px;

        button {
            margin-top: 15px;
            width: 100%;
        }
    }
`;