import meta from "./analyze-meta";
import read from "./analyze-read";

function makeAnalysisState() {
  return {
    importBindings: []
  };
}

export default function() {
  const state = makeAnalysisState();
  return {
    meta: meta(state),
    read: read(state)
  };
}
