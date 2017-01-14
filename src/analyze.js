function throwIncorrectASTError(path, analyzedDefinitionIds, parentPath) {
  console.log(analyzedDefinitionIds, parentPath.node, ">>>>>");
  throw new Error("GOGO FIXME");
}

function analyze(path, nodeDefinitionId, analyzedDefinitionIds, nodeDefinitions, config) {

  function analyzeParents(path, nodeDefinitionIds = []) {
    if (nodeDefinitionIds.length) {
      const [nodeDefinitionId, ...rest] = nodeDefinitionIds;
      return analyze(path, nodeDefinitionId, analyzedDefinitionIds.concat(nodeDefinitionId), nodeDefinitions, config) || analyzeParents(path, rest);
    }
  }

  const nodeDefinition = nodeDefinitions.find(n => n.id === nodeDefinitionId);

  const [isValid, getParentAndArgs] =
    nodeDefinition.type === "predicate" ?
      [
        nodeDefinition.predicate(path, config),
        () => [
          nodeDefinition.getParentPath ? nodeDefinition.getParentPath(path) : undefined,
          nodeDefinition.args(path)
        ]
      ] :
    nodeDefinition.type === "CallExpression" && path.isCallExpression() && path.node.callee.property.name === nodeDefinition.name ?
      [
        true,
        () => [
          path.get("callee").get("object"),
          nodeDefinition.args(path.get("arguments"))
        ]
      ] :
    nodeDefinition.type === "MemberExpression" && path.isMemberExpression() && path.node.property.name === nodeDefinition.name ?
      [
        true,
        () => [path.get("object")]
      ] :
    [];

  /*
    Errors
    ======
    If it is indeed a node we should analyze, there are two errors that might follow.
      1. There is a mismatch in the node order in the AST
        eg: db.todos.map().filter(); // filter() doesn't expect to be preceded by a map()
      2. We couldn't even get started;
        eg: db.todos.reduce() // reduce() isn't a supported transformation
  */
  if (isValid) {
    const [parentPath, args] = getParentAndArgs();
    if (parentPath) {
      const builderResult = analyzeParents(parentPath, nodeDefinition.follows);
      if (builderResult) {
        return nodeDefinition.builder(builderResult, args);
      } else {
        //Expected a valid parent node, found none.
        throwIncorrectASTError(path, analyzedDefinitionIds, parentPath);
      }
    } else {
      return nodeDefinition.builder(args);
    }
  }
}

/*
  There are two types of ASTs we'll encounter.
    1. ASTs formed from a "root" node which we're expected to analyze
    2. AST which we should skip, since we can't find the "root" node.
    The mustAnalyze predicate decides if an AST is (1) or (2)
*/
export default function(nodeDefinitions, mustAnalyze) {
  return function(path, nodeDefinitionIds, config) {
    if (mustAnalyze(path, config)) {
      const result = (function f(args) {
        if (args.length) {
          const [nodeDefinitionId, ...rest] = args;
          return analyze(path, nodeDefinitionId, [], nodeDefinitions, config) || f(rest);
        }
      })(nodeDefinitionIds);

      if (result) {
        return result;
      } else {
        throwIncorrectASTError(path, []);
      }
    }
  }
}
