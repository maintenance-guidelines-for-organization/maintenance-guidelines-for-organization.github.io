// MIT © 2017 azu
import * as FileSaver from "file-saver";

export function saveAsFile(text: string, fileName: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, fileName);
}
