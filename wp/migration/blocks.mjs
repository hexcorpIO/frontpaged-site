// Markdown → Gutenberg block markup.
//
// Done here rather than in PHP because `marked` already parses this exact
// content for the live site, so the block conversion starts from the same token
// stream the current pages are built from.
//
// Why blocks and not HTML: WordPress will happily store raw HTML in post_content
// and render it. But the block editor shows it as one opaque "Classic" blob
// that nobody can edit paragraph by paragraph — which removes the single reason
// to move to WordPress. Real blocks mean an editor can rewrite one paragraph
// without touching anything else.
import { marked } from "marked";

// marked.parseInline renders bold/links/code without wrapping in <p>, which is
// exactly what a block's inner HTML needs. Building a synthetic token stream and
// calling the block parser instead was the first attempt and it threw on list
// items — this is both simpler and correct.
const inline = (markdown) => marked.parseInline(String(markdown ?? "")).trim();

function listBlock(token) {
  const tag = token.ordered ? "ol" : "ul";
  const items = token.items
    .map((i) => `<li>${inline(i.text)}</li>`)
    .join("\n");
  const attrs = token.ordered ? ' {"ordered":true}' : "";
  return `<!-- wp:list${attrs} -->\n<${tag} class="wp-block-list">\n${items}\n</${tag}>\n<!-- /wp:list -->`;
}

export function markdownToBlocks(markdown) {
  const tokens = marked.lexer(markdown);
  const out = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const level = Math.min(Math.max(token.depth, 2), 6); // h1 belongs to the page title
        out.push(
          `<!-- wp:heading {"level":${level}} -->\n` +
            `<h${level} class="wp-block-heading">${inline(token.text)}</h${level}>\n` +
            `<!-- /wp:heading -->`
        );
        break;
      }
      case "paragraph":
        out.push(`<!-- wp:paragraph -->\n<p>${inline(token.text)}</p>\n<!-- /wp:paragraph -->`);
        break;
      case "list":
        out.push(listBlock(token));
        break;
      case "blockquote":
        out.push(
          `<!-- wp:quote -->\n<blockquote class="wp-block-quote">` +
            markdownToBlocks(token.raw.replace(/^>\s?/gm, "")) +
            `</blockquote>\n<!-- /wp:quote -->`
        );
        break;
      case "code":
        out.push(
          `<!-- wp:code -->\n<pre class="wp-block-code"><code>${token.text}</code></pre>\n<!-- /wp:code -->`
        );
        break;
      case "table": {
        const head = token.header.map((c) => `<th>${inline(c.text)}</th>`).join("");
        const body = token.rows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c.text)}</td>`).join("")}</tr>`)
          .join("\n");
        out.push(
          `<!-- wp:table -->\n<figure class="wp-block-table"><table>` +
            `<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></figure>\n<!-- /wp:table -->`
        );
        break;
      }
      case "hr":
        out.push(`<!-- wp:separator -->\n<hr class="wp-block-separator"/>\n<!-- /wp:separator -->`);
        break;
      case "html":
        out.push(`<!-- wp:html -->\n${token.text}\n<!-- /wp:html -->`);
        break;
      case "space":
        break;
      default:
        if (token.raw?.trim()) {
          out.push(`<!-- wp:paragraph -->\n<p>${token.raw.trim()}</p>\n<!-- /wp:paragraph -->`);
        }
    }
  }

  return out.join("\n\n");
}
