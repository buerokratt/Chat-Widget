import React, { ReactElement, useRef } from "react";
import { motion } from "framer-motion";
import { ChatMessageStyled } from "../ChatMessageStyled";
import useScreenReaderAnnouncement from "../../../hooks/use-screen-reader-announcement";
import { Message } from "../../../model/message-model";
import useChatSelector from "../../../hooks/use-chat-selector";

const EventMessage = (props: { content: ReactElement }): JSX.Element => {
  const { content } = props;
  const { chatId } = useChatSelector();
  const screenReaderRef = useRef<HTMLDivElement>(null);
  const announcementText: any = typeof content === "string" ? content : "";
  const message: Message = {
    content: announcementText,
    chatId: chatId ?? null,
    authorTimestamp: "",
  };
  useScreenReaderAnnouncement(message, screenReaderRef);

  return (
    <motion.div>
      <div
        ref={screenReaderRef}
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "0.1px",
          height: "0.1px",
          overflow: "hidden",
        }}
      />
      <ChatMessageStyled className={`message event`}>
        <div>
          <div aria-live="polite">{content}</div>
        </div>
      </ChatMessageStyled>
    </motion.div>
  );
};

export default EventMessage;
