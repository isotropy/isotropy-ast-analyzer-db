import meta from "./analyze-meta";
import read from "./analyze-read";

const analysisState = {
  importBindings: []
}

export default function() {
  return {
    meta: meta(analysisState),
    read: read(analysisState)
  }
}
