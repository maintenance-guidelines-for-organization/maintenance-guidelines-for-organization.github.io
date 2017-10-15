import * as React from "react";
import "./App.css";
import "office-ui-fabric-react/dist/css/fabric.css";
import { GuideState, GuideStore, SUPPORT_LANG, SUPPORT_LANG_GROUP } from "../store/GuideStore";
import { TextField } from "office-ui-fabric-react";
import { updateGuideState } from "../action/updateGuideState";
import { LanguageSelector } from "./LanguageSelector";
import { fetchGuideContent } from "../action/fetchGuideContent";

const Markdown = require("react-remarkable");

export interface AppProps {
    guide: GuideStore;
}

export interface AppState {
    guide: GuideState;
}

export class App extends React.Component<AppProps, AppState> {
    private onChangedLanguage = (lang: SUPPORT_LANG) => {
        fetchGuideContent(this.props.guide, lang);
    };

    componentWillMount() {
        this.props.guide.onChange(() => {
            this.setState({
                guide: this.props.guide.state
            });
        });
        this.setState({
            guide: this.props.guide.state
        });
    }

    componentWillUnmount() {
        this.props.guide.removeAllListeners();
    }

    render() {
        const guideState = this.state.guide;
        const content =
            guideState && guideState.haveBeenFilled ? (
                <div className="App-content">
                    <textarea className="App-contentSource" value={guideState.source!.content} readOnly={true} />
                    <div className="App-contentPreview">
                        <Markdown source={guideState.source!.content} />
                    </div>
                </div>
            ) : null;
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Maintenance Guidelines for Organization</h1>
                </div>
                <a href="https://github.com/maintenance-guidelines-for-organization/guide">
                    <img
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            border: 0
                        }}
                        src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
                        alt="Fork me on GitHub"
                    />
                </a>
                <div className="App-form">
                    <TextField
                        label="Organization Email"
                        required={true}
                        value={guideState.emailAddress}
                        onChanged={newValue => {
                            updateGuideState(this.props.guide, {
                                emailAddress: newValue
                            });
                        }}
                    />
                    <TextField
                        label="GitHub Organization name"
                        required={true}
                        value={guideState.gitHubOrganizationName}
                        onChanged={newValue => {
                            updateGuideState(this.props.guide, {
                                gitHubOrganizationName: newValue
                            });
                        }}
                    />
                    <TextField
                        label="npm Organization name"
                        required={true}
                        value={guideState.npmOrganizationName}
                        onChanged={newValue => {
                            updateGuideState(this.props.guide, {
                                npmOrganizationName: newValue
                            });
                        }}
                    />
                    <TextField
                        label="Organization Code Of Conduct URL"
                        type="url"
                        required={true}
                        value={guideState.codeOfConductLink}
                        onChanged={newValue => {
                            updateGuideState(this.props.guide, {
                                codeOfConductLink: newValue
                            });
                        }}
                    />
                    <LanguageSelector
                        languages={SUPPORT_LANG_GROUP}
                        selectedLang={this.state.guide.source ? this.state.guide.source!.lang : SUPPORT_LANG.en}
                        onChanged={this.onChangedLanguage}
                    />
                </div>
                {content}
            </div>
        );
    }
}
