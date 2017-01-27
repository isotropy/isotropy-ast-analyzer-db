const packageNameUpdater = {
  StringLiteral(path) {
    if (path.node.value === this.clientPackageName) {
      path.node.value = this.serverPackageName;
    }
  }
}

export function transformImportDeclaration(path, analysis, state, config) {
  path.traverse(packageNameUpdater, { clientPackageName: config.clientPackageName, serverPackageName: config.serverPackageName });
}
