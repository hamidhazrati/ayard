import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { IsMarkdownFile } from './helpers/is-markdown-file';

const EXTERNAL_LINK_ICON_MODIFIER = 'icon--external-link';
const FILE_EXTENSION_PATTERN = /\.[0-9a-z]+$/i;

function getFileExt(fileName: string): string {
  const match = fileName.match(FILE_EXTENSION_PATTERN);
  return match?.length ? match[0].substr(1) : '';
}

function getFileIconModifier(text: string) {
  const ext = getFileExt(text);
  switch (ext) {
    case 'xls':
      return 'icon--xls';
    case 'csv':
      return 'icon--csv';
    case 'json':
      return 'icon--json';
    case 'pdf':
      return 'icon--pdf';
    case 'doc':
    case 'docs':
      return 'icon--word';
    case 'tiff':
    case 'png':
    case 'jpeg':
      return 'icon--tiff';
    case 'zip':
      return 'icon--zip';
  }
}

function createFileIconEl(iconModifier: string): string {
  return `<icon class="icon ${iconModifier}"></icon>`;
}

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.link = (href: string, title: string, text: string) => {
    let anchorBody = text;

    const fileIcon = getFileIconModifier(text);
    if (fileIcon) {
      anchorBody = createFileIconEl(fileIcon) + text;
    } else if (IsMarkdownFile(href) !== true) {
      anchorBody = text + createFileIconEl(EXTERNAL_LINK_ICON_MODIFIER);
    }

    return `<a href="${href}" target="_blank"  title="${title}">
      ${anchorBody}
      </a>`;
  };

  return {
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}
