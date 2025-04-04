import {useRef, useState} from "react";
import Button from "../button";
import {ButtonColor} from "../button/button";
import {InputText} from "primereact/inputtext";
import {useAppDispatch} from "../../store";
import {useTranslation} from "react-i18next";
import {Download, DownloadElement} from "../../hooks/use-download-file";
import {downloadChat, setEmailAdress} from "../../slices/chat-slice";
import {EMAIL_REGEX} from "../../constants";
import useChatSelector from "../../hooks/use-chat-selector";
import {ConfirmationModalStyled} from "./ConfirmationModalStyled";

const ConfirmationModalDownload = () => {
    const {t} = useTranslation();
    const {endUserContacts} = useChatSelector();
    const [showForwardForm, setShowForwardForm] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const downloadRef = useRef<DownloadElement>(null);
    const [invalidMessage, setInvalidMessage] = useState("");
    const handleDownload = async (isForwardToEmail: boolean) => {
        if (
            isForwardToEmail &&
            (endUserContacts.mailAddress === "" ||
                !new RegExp(EMAIL_REGEX).test(endUserContacts.mailAddress))
        ) {
            setInvalidMessage(t("widget.contacts.contact.invalid.email"));
            return false;
        }

        const response = await dispatch(downloadChat(isForwardToEmail));
        if (response.meta.requestStatus === "rejected") return false;
        downloadRef.current?.download({
            title: `chat-history.pdf`,
            data: (response.payload as any).data,
        });
        return true;
    };

    return (
        <ConfirmationModalStyled>
            <div className="downloadContainer">
                {!showForwardForm ? (
                    <>
                        <Download ref={downloadRef}/>
                        <button
                            className="downloadLink"
                            onClick={() => handleDownload(false)}
                        >
                            {t("widget.action.download-chat")}
                        </button>
                        {/* <a onClick={() => setShowForwardForm(true)} className={styles.downloadLink}>
            {t("widget.action.forward-chat")}
          </a> */}
                    </>
                ) : (
                    <form className="forwardForm">
                        <div className="forwardInput">
                            <InputText
                                id="email-input"
                                className="email-input"
                                placeholder={t("widget.action.forward-email")}
                                pattern={EMAIL_REGEX}
                                value={endUserContacts.mailAddress}
                                onChange={(e) => {
                                    dispatch(setEmailAdress(e.target.value));
                                    setInvalidMessage("");
                                }}
                            />
                            <hr className="divider"/>
                            {invalidMessage && (
                                <p className="missingFeedback">{invalidMessage}</p>
                            )}
                        </div>
                        <div className="downloadActions">
                            <Button
                                onClick={() => setShowForwardForm(false)}
                                title={t("widget.action.skip")}
                                color={ButtonColor.GRAY}
                            >
                                {t("widget.action.skip")}
                            </Button>
                            <Button
                                onClick={() =>
                                    handleDownload(true).then((res) => {
                                        if (res) setShowForwardForm(false);
                                    })
                                }
                                title={t("widget.action.confirm")}
                                color={ButtonColor.BLUE}
                            >
                                {t("widget.action.confirm")}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </ConfirmationModalStyled>
    );
};

export default ConfirmationModalDownload;
