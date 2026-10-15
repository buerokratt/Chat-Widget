import styled from "styled-components";

export const TextAreaStyle = styled.textarea`
    width: 100%;
    outline: 0;
    border: 0;
    background: transparent;
    resize: vertical;
    overflow: auto;
    resize: none;
`;

export const UnavailableEndUserContactsStyle = styled.div`{

    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overflow-wrap: anywhere;

    input,
    textarea {
        border: 0;
        border-bottom: 1px solid #003cff;
        padding-bottom: 5px;
        width: 100%;
    }
    
    .h3-style {
        display: block;
        font-size: 1.17em;
        margin-top: 1em;
        margin-bottom: 1em;
        margin-left: 0;
        margin-right: 0;
        font-weight: bold;
    }
    
    .p-style {
        display: block;
        margin-top: 1em;
        margin-bottom: 1em;
        margin-left: 0;
        margin-right: 0;
    }

    .h5-style {
        margin: 0.5rem 0 0 0;
        display: block;
        font-size: .83em;
        font-weight: bold;
    }

    .form-header {
        margin-bottom: 0.1rem;
        text-align: center;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .container {
        display: flex;
        flex-direction: column;
        margin: auto 0;
        min-height: 0;
        max-height: 100%;

        > :not(.form-header) {
            flex-shrink: 0;
        }

        &.with-contacts {
            flex-shrink: 0;
            max-height: none;

            .form-header {
                flex-shrink: 0;
                max-height: 6em;
            }
        }
    }

    .form-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
        gap: 0.5rem;
    }

    form {
        height: 100%;
        box-sizing: border-box;
        padding-bottom: 0.5rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .form-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: medium;

        .email-group,
        .phone-nr-group {
            padding-bottom: 0.7rem;
            width: 100%;
        }

        .comment-group {
            width: 100%;
        }

        .email-input:invalid,
        .phone-nr-input:invalid {
            border-color: #ff4800;
        }
    }

    .input-labels {
        display: flex;
        align-items: flex-start;
        justify-items: flex-start;
    }

    .missing-feeback {
        color: #ff4800;
        margin-bottom: -0.5em;
        font-size: 0.75rem;
    }
}
`;
