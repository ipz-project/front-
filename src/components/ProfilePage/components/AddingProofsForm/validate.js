export function validateLinks(link) {
    const LINKS_REGEXP =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    if (LINKS_REGEXP.test(String(link).toLowerCase())) {
        return { error: "", state: true };
    } else {
        let msg = "";
        if (link.trim() === "") {
            msg = "*empty field";
        } else if (!LINKS_REGEXP.test(String(link))) {
            msg = "*not valid link";
        }
        return { error: msg, state: false };
    }
}

export function validateText(text) {
    const TEXT_REGEXP = /^[A-Za-z0-9'".,:;@#?!()[\]*_/-—\s]{0,255}$/;
    if (TEXT_REGEXP.test(String(text).toLowerCase())) {
        return { error: "", state: true };
    } else {
        let msg = "";
        if (text.trim() === "") {
            msg = "*empty field";
        } else if (text.length > 255) {
            msg = "*the value is too long (not more 255 symbols)";
        } else if (!TEXT_REGEXP.test(String(text))) {
            msg = "*using incorrect symbols";
        }
        return { error: msg, state: false };
    }
}
