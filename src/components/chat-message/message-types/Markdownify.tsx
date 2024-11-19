import React from 'react';
import Markdown from "markdown-to-jsx";

interface MarkdownifyProps {
  message: string | undefined;
}
const Markdownify: React.FC<MarkdownifyProps> = ({ message }) => (
  <div>
    <Markdown options={{ enforceAtxHeadings: true, overrides: { a: { props: { target: "_blank" } } } }}>
      {message ?? ""}
    </Markdown>
  </div>
);

export default Markdownify;
