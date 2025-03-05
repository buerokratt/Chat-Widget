import React from 'react';
import styled from 'styled-components';

interface WarningNotificationProps {
    warningMessage: string;
}

const WarningNotification = (props: WarningNotificationProps): JSX.Element => {
    const {warningMessage = ''} = props;
    return (
        <div className="byk-chat">
            <WarningStyle>
                <div className="warning">{warningMessage}</div>
            </WarningStyle>
        </div>
    );
};

const WarningStyle = styled.div`
    :global(.byk-chat) {
        .warning {
            text-align: center;
            padding: 0.25em;
            color: #3c0078;
            background-color: #fcedc5;
        }
    }
`;
export default WarningNotification;
