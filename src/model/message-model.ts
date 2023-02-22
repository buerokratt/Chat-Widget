export interface MessageFile {
    name: string;
    type: MessageFileTypes;
    size: number;
    base64: string;
}

export interface Message {
    chatId: string | null;
    id?: string;
    content?: string;
    file?: MessageFile;
    event?: string;
    rating?: string;
    authorId?: string;
    authorTimestamp: string;
    authorFirstName?: string;
    authorLastName?: string;
    authorRole?: string;
    created?: string;
    updated?: string;
    data?: {
        forwarding_validation?: string;
    };
}

export enum MessageFileTypes {
    // TODO add correct file types Ticket: https://github.com/buerokratt/Buerokratt-Chatbot/issues/30
    PDF = 'application/pdf',
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    TXT = 'text/plain', // TODO SLICE NAME
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // TODO SLICE NAME
    ODT = 'application/vnd.oasis.opendocument.text', // NOT SPECIFIED
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // TODO SLICE NAME
    // ODS = 'ods', // NOT SPECIFIED
    BDOC = 'application/vnd.etsi.asic-e+zip', // TODO VERIFY, could not find an example
    CDOC = 'application/x-cdoc', // NOT SPECIFIED
    ASICE = 'application/vnd.etsi.asic-e+zip', // TODO SLICE NAME
    MP3 = 'audio/mpeg', // TODO VERIFY, could not find an example
    WAV = 'audio/wav', // TODO VERIFY, could not find an example
    M4A = 'audio/x-m4a',
    MP4 = 'video/mp4',// TODO
    WEBM = 'video/webm',// TODO
    OGG = 'video/ogg',// TODO
    MOV = 'video/quicktime',// TODO
}