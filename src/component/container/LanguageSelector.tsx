// MIT © 2017 azu
import * as React from "react";
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react";
import { SUPPORT_LANG, SUPPORT_LANG_GROUP } from "../store/GuideStore";

export interface LanguageSelectorProps {
    languages: typeof SUPPORT_LANG_GROUP;
    selectedLang: SUPPORT_LANG;

    onChanged: (newLanguage: SUPPORT_LANG) => void;
}

export class LanguageSelector extends React.Component<LanguageSelectorProps, {}> {
    private onChanged = (event: any, options: IChoiceGroupOption) => {
        this.props.onChanged(options.text as SUPPORT_LANG);
    };

    render() {
        return (
            <ChoiceGroup
                onChange={this.onChanged}
                label="Select language"
                selectedKey={this.props.selectedLang}
                options={this.props.languages.map(lang => {
                    return {
                        key: lang.lang,
                        text: lang.text,
                        iconProps: { iconName: "LocaleLanguage" }
                    };
                })}
            />
        );
    }
}
