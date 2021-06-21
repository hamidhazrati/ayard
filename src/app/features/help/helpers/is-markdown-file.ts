export function IsMarkdownFile(path: string) {
  return path.substr(-3) === '.md';
}
