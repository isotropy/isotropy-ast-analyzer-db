const packageNameUpdater = {
  StringLiteral(path) {
    path.node.value = this.packageName;
  }
}

export function transformImportDeclaration(path, analysis, state, config) {
  path.traverse(packageNameUpdater, { packageName: config.serverPackageName });
}
