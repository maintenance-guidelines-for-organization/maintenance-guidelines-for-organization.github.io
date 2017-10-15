// MIT © 2017 azu
import { GuideStateArgs, GuideStore } from "../store/GuideStore";

export function updateGuideState(guide: GuideStore, stateArg: GuideStateArgs) {
    guide.update(stateArg);
}
