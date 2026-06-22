import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { ChatMessageStyled } from "../ChatMessageStyled";

const EventMessage = (props: { content: ReactElement }): JSX.Element => {
  const { content } = props;

  return (
    <motion.div aria-live="off">
      <ChatMessageStyled className={`message event`}>
        <div>
          <div>{content}</div>
        </div>
      </ChatMessageStyled>
    </motion.div>
  );
};

export default EventMessage;
