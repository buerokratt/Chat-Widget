import { AUTHOR_ROLES, CHAT_EVENTS, CHAT_MODES } from "../constants";
import { Message, MessageButton } from "../model/message-model";
import { EndUserContacts } from "../slices/chat-slice";

export const filterDocReferences = (text: string): string => text.replaceAll(/\[do?c?\s*\d*\s*\]?/g, "");

interface Citation {
  url: string;
  title: string;
  filepath: string;
}

const SUPERSCRIPT_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

const toSuperscript = (num: number): string =>
  String(num)
    .split("")
    .map((digit) => SUPERSCRIPT_DIGITS[Number(digit)])
    .join("");

const buildCitationLinkLine = (displayNum: number, citation: Citation): string => {
  const link = `  • ${toSuperscript(displayNum)} [${citation.title}](${citation.filepath})`;
  try {
    return `${link}\n- ${JSON.parse(citation.url).join("\n")}\n\n`;
  } catch {
    try {
      new URL(citation.url);
      return `${link}\n- ${citation.url}\n\n`;
    } catch {
      try {
        new URL(citation.filepath);
        return link;
      } catch {
        return "";
      }
    }
  }
};

export const formatCitations = (content: string, context?: { citations?: Citation[] }): string => {
  if (!context?.citations) return content;

  const uniqueCitations: Citation[] = [];
  const filepathToUniqueIndex = new Map<string, number>();
  const originalDocToUniqueDoc = new Map<number, number>();
  context.citations.forEach((citation, index) => {
    if (!filepathToUniqueIndex.has(citation.filepath)) {
      filepathToUniqueIndex.set(citation.filepath, uniqueCitations.length);
      uniqueCitations.push(citation);
    }
    originalDocToUniqueDoc.set(index + 1, filepathToUniqueIndex.get(citation.filepath)!);
  });

  const appearanceOrder: number[] = [];
  const docRefRegex = /\[doc(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = docRefRegex.exec(content)) !== null) {
    const uniqueIndex = originalDocToUniqueDoc.get(Number(match[1]));
    if (uniqueIndex !== undefined && !appearanceOrder.includes(uniqueIndex)) {
      appearanceOrder.push(uniqueIndex);
    }
  }

  let formattedContent = content;
  originalDocToUniqueDoc.forEach((uniqueIndex, originalDocNum) => {
    const displayIndex = appearanceOrder.indexOf(uniqueIndex);
    if (displayIndex === -1) return;
    formattedContent = formattedContent.replaceAll(`[doc${originalDocNum}]`, `⁽${toSuperscript(displayIndex + 1)}⁾`);
  });

  formattedContent = formattedContent
    .replaceAll(/([)\\/\p{L}\p{N}])⁽/gu, "$1 ⁽")
    .replaceAll(/(⁽[⁰¹²³⁴⁵⁶⁷⁸⁹]+⁾)\1+/g, "$1");

  const links = appearanceOrder
    .map((uniqueIndex, i) => buildCitationLinkLine(i + 1, uniqueCitations[uniqueIndex]))
    .filter((line) => line);
  if (links.length > 0) {
    formattedContent += "\n\nViited:\n" + links.join("\n");
  }

  return formattedContent;
};

export const parseButtons = (message: Message): MessageButton[] => {
  try {
    if(!message?.buttons || message.buttons === '')
      return [];
    return JSON.parse(message.buttons) as MessageButton[];
  } catch(e) {
    console.error(e);
    return [];
  }
}

export const parseOptions = (message: Message): string[] => {
  try {
    if(!message?.options || message.options === '')
      return [];
    return JSON.parse(message.options) as string[];
  } catch(e) {
    console.error(e);
    return [];
  }
}

export const getChatModeBasedOnLastMessage = (messages: Message[]): CHAT_MODES => {
  let lastMsgButtonsCount = 0;

  if(messages && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    const buttons = parseButtons(lastMsg);
    lastMsgButtonsCount = buttons.length;
  }

  return lastMsgButtonsCount === 0 ? CHAT_MODES.FREE : CHAT_MODES.FLOW;
}

export const getContactFormFulfilledNewMessage = (
  endUserContacts: EndUserContacts,
  chatId: string | null,
  messageId: string,
  t: any,
): Message => {
  let message;
  if (endUserContacts.phoneNr && endUserContacts.mailAddress) {
    message = t("chatMessage.email-and-phone-template", {
      email: endUserContacts.mailAddress,
      phoneNr: endUserContacts.phoneNr,
    });
  } else if (endUserContacts.mailAddress){
    message = t("chatMessage.email-only-template", {
      email: endUserContacts.mailAddress,
    });
  } else {
    message = t("chatMessage.phone-only-template", {
      phoneNr: endUserContacts.phoneNr,
    });
  }

  return {
    chatId,
    id: messageId,
    authorRole: AUTHOR_ROLES.END_USER,
    authorTimestamp: new Date().toISOString(),
    content: message,
    event: CHAT_EVENTS.CONTACT_INFORMATION_FULFILLED,
    preview: "",
  };
}

export const getContactCommentNewMessage = (
  comment: string,
  chatId: string | null,
  messageId: string,
  t: any,
): Message => {
  const message = t("chatMessage.comment-template", { comment });
  
  return {
    chatId,
    id: messageId,
    authorRole: AUTHOR_ROLES.END_USER,
    authorTimestamp: new Date().toISOString(),
    content: message,
    event: "",
    preview: "",
  };
}

export const filterDuplicatMessages = (messages: Message[]|any[]): Message[]|any[] => {
  const seen = new Set();
  const result = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const duplicate = seen.has(messages[i].id);
    seen.add(messages[i].id);
    if(!duplicate || !messages[i].id) {
      result.unshift(messages[i]);
    }
  }

  return result;
}
