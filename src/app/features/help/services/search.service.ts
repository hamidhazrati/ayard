import { Injectable } from '@angular/core';
import { HelpConfigItemModel } from './../models/help-config-item.model';

@Injectable()
export class SearchService {
  search(helpConfigItem: HelpConfigItemModel, md: string, term: string): boolean {
    const lowerCaseTerm = term.toLowerCase();
    const checkTitles = [helpConfigItem.description, helpConfigItem.title].some((text) =>
      text.toLowerCase().includes(lowerCaseTerm),
    );

    if (checkTitles) {
      return true;
    }

    const plainText = this.escapeMarkdownSyntax(md);
    return plainText.search(term) >= 0;
  }

  private escapeMarkdownSyntax(body: string): string {
    let result = body.toLowerCase();

    result = result
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, '\n\n');

    return result;
  }
}
