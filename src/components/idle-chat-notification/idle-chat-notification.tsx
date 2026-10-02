import {FC, useRef} from "react";
import {useTranslation} from 'react-i18next';
import Button from '../button/button';
import {useAppDispatch} from '../../store';
import {setIdleChat} from '../../slices/chat-slice';
import {IdleChatNotificationStyled} from "./IdleChatNotificationStyled";
import useFocusTrap from "../../hooks/useFocusTrap";
import useExtendJwt from '../../hooks/use-extend-jwt';

interface IdleChatNotificationProps {
    customMessage?: string;
}


const IdleChatNotification: FC<IdleChatNotificationProps> = ({customMessage}) => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const extendJwt = useExtendJwt();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dismissIdle = () => {
        dispatch(setIdleChat({ isIdle: false, lastActive: new Date().getTime() }));
        void extendJwt();
    };
    useFocusTrap(dialogRef, { focusFirstOnMount: true, onEscape: dismissIdle });

    return (
        <IdleChatNotificationStyled>
            <div className="byk_container">
                <dialog
                    ref={dialogRef}
                    className="byk_content"
                    aria-modal="true"
                    aria-labelledby={t("notifications.idle-chat-notification")}
                >
                    <>
                        <div className="byk_title h2-style" role="heading" aria-level={2}>
                            {customMessage || t("notifications.idle-chat-notification")}
                        </div>
                        <div className="byk_actions">
                            <Button
                                title={t("widget.action.yes")}
                                onClick={dismissIdle}
                            >
                                {t("widget.action.continue")}
                            </Button>
                        </div>
                    </>
                </dialog>
            </div>
        </IdleChatNotificationStyled>
    );
};

export default IdleChatNotification;
