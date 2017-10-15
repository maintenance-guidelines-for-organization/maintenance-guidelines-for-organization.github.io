import * as React from "react";
import "./App.css";
import "office-ui-fabric-react/dist/css/fabric.css";
import { GuideState, GuideStore, SUPPORT_LANG, SUPPORT_LANG_GROUP } from "../store/GuideStore";
import { ActionButton, TextField } from "office-ui-fabric-react";
import { updateGuideState } from "../action/updateGuideState";
import { LanguageSelector } from "./LanguageSelector";
import { fetchGuideContent } from "../action/fetchGuideContent";
import { saveAsFile } from "../action/saveAsFile";

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
    private onClickDownloadButton = () => {
        if (this.state.guide.source) {
            saveAsFile(this.state.guide.source.content, "maintenance-guidelines-for-organization.md");
        }
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
                    <header className="App-contentHeader">
                        <div className="App-contentDownloadButton">
                            <ActionButton iconProps={{ iconName: "Download" }} onClick={this.onClickDownloadButton}>
                                Download as file
                            </ActionButton>
                        </div>
                    </header>
                    <div className="App-contentBody">
                        <textarea className="App-contentSource" value={guideState.source!.content} readOnly={true} />
                        <div className="App-contentPreview">
                            <Markdown source={guideState.source!.content} />
                        </div>
                    </div>
                </div>
            ) : null;
        return (
            <div className="App">
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
                <div className="App-header">
                    <h1 className="App-headerTitle">Maintenance Guidelines for Organization</h1>
                    <p className="App-headerSubDescription">
                        This guideline aim to avoid stopping the project by human bottlenecks.
                    </p>
                </div>
                <div className="App-descriptor">
                    <ul className="App-descriptorList">
                        <li className="App-descriptorListItem">
                            <h3 className="App-descriptorListItemTitle">Avoid human bottlenecks</h3>
                            <p className="App-descriptorListItemDescription">
                                In order to minimize human bottlenecks, all members should be fully empowered to do
                                everything that might be necessary to handle administration of the project.
                            </p>
                        </li>
                        <li className="App-descriptorListItem">
                            <h3 className="App-descriptorListItemTitle">Trust people to do the right thing</h3>
                            <p className="App-descriptorListItemDescription">
                                For some actions, it might be good to discuss with other members and the community about
                                the best course of action. For other decisions, it might be better to take individual
                                initiative.
                            </p>
                        </li>
                    </ul>
                </div>
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
