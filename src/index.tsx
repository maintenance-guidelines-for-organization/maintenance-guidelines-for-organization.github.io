import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./component/container/App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { GuideStore, SUPPORT_LANG } from "./component/store/GuideStore";
import { fetchGuideContent } from "./component/action/fetchGuideContent";

const guideStore = new GuideStore();
fetchGuideContent(guideStore, SUPPORT_LANG.en);
ReactDOM.render(<App guide={guideStore} />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
