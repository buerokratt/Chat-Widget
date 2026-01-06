import React, { ReactElement, useRef } from "react";
import { motion } from "framer-motion";
import { ChatMessageStyled } from "../ChatMessageStyled";
import useScreenReaderAnnouncement from "../../../hooks/use-screen-reader-announcement";

const EventMessage = (props: { content: ReactElement }): JSX.Element => {
  const { content } = props;
  const screenReaderRef = useRef<HTMLDivElement>(null);
  useScreenReaderAnnouncement(content.props.children.toString(), screenReaderRef);

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
