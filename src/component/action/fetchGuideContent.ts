// MIT © 2017 azu

import { GuideStore, SUPPORT_LANG } from "../store/GuideStore";

const GitHub = require("github-api");

export function fetchGuideContent(store: GuideStore, lang: SUPPORT_LANG) {
    const gh = new GitHub();
    const guidePath = store.getPathForLang(lang);
    const repo = gh.getRepo("maintenance-guidelines-for-organization", "guide");
    return repo.getContents("master", guidePath, true).then((response: { data: string }) => {
        store.setSource({
            lang: lang,
            path: guidePath,
            content: response.data
        });
    });
}
