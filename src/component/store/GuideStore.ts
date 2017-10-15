// MIT © 2017 azu
import { EventEmitter } from "events";

export enum SUPPORT_LANG {
    en = "en"
}

export const SUPPORT_LANG_GROUP = [
    {
        lang: SUPPORT_LANG.en,
        text: "English"
    }
];

export enum GUIDE_PATH {
    en = "content/en/README.md"
}

export interface GuideLineSource {
    lang: SUPPORT_LANG;
    path: GUIDE_PATH;
    content: string;
    originalContent?: string;
}

export interface GuideStateArgs {
    gitHubOrganizationName?: string;
    npmOrganizationName?: string;
    emailAddress?: string;
    codeOfConductLink?: string;
    source?: GuideLineSource;
}

const replace = (content: string, patterns: { pattern: RegExp; replaceTo?: string }[]) => {
    return patterns.reduce((r, pattern) => {
        if (!pattern.replaceTo) {
            return r;
        }
        return r.replace(pattern.pattern, pattern.replaceTo);
    }, content);
};

export class GuideState {
    gitHubOrganizationName?: string;
    npmOrganizationName?: string;
    emailAddress?: string;
    codeOfConductLink?: string;
    source?: GuideLineSource;

    constructor(args: GuideStateArgs) {
        this.gitHubOrganizationName = args.gitHubOrganizationName;
        this.npmOrganizationName = args.npmOrganizationName;
        this.emailAddress = args.emailAddress;
        this.codeOfConductLink = args.codeOfConductLink;
        this.source = this.replaceSource(args);
    }

    get haveBeenFilled() {
        return (
            this.gitHubOrganizationName &&
            this.npmOrganizationName &&
            this.emailAddress &&
            this.codeOfConductLink &&
            this.source
        );
    }

    replaceSource(args: GuideStateArgs) {
        if (!args.source) {
            return;
        }
        const replacedContent = replace(args.source.originalContent || args.source.content, [
            {
                pattern: /\[\[CODE_OF_CONDUCT_LINK\]\]/g,
                replaceTo: args.codeOfConductLink
            },
            {
                pattern: /\[\[GITHUB_ORGANIZATION_NAME\]\]/g,
                replaceTo: args.gitHubOrganizationName
            },
            {
                pattern: /\[\[NPM_ORGANIZATION_NAME\]\]/g,
                replaceTo: args.npmOrganizationName
            },
            {
                pattern: /\[\[INSERT_EMAIL_ADDRESS\]\]/g,
                replaceTo: args.emailAddress
            }
        ]);
        return {
            ...args.source,
            content: replacedContent,
            originalContent: args.source.originalContent ? args.source.originalContent : args.source.content
        };
    }

    update(args: GuideStateArgs) {
        return new GuideState({
            ...(this as GuideStateArgs),
            ...args
        });
    }
}

export class GuideStore extends EventEmitter {
    state: GuideState;

    constructor() {
        super();
        this.state = new GuideState({
            codeOfConductLink: "http://example.com/code_of_conduct.md",
            gitHubOrganizationName: "GITHUB_ORGANIZATION",
            npmOrganizationName: "NPM_ORGANIZATION",
            emailAddress: "your-organization@example.com"
        });
    }

    update(args: GuideStateArgs) {
        this.state = this.state.update(args);
        this.emitChange();
    }

    setSource(param: { lang: SUPPORT_LANG; path: GUIDE_PATH; content: string }) {
        this.state = this.state.update({
            source: param
        });
        this.emitChange();
    }

    // store

    emitChange() {
        this.emit("CHANGE");
    }

    onChange(handler: () => void) {
        this.on("CHANGE", handler);
    }

    getPathForLang(lang: SUPPORT_LANG): GUIDE_PATH {
        switch (lang) {
            case SUPPORT_LANG.en:
                return GUIDE_PATH.en;
            default:
                return GUIDE_PATH.en;
        }
    }
}
