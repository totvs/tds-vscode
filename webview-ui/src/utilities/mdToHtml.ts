/**
 * @packageDocumentation
 *
 * Provides the main method used to convert markdown to html.
 */

/**
 * Converts the provided markdown to HTML.
 */
export function markdownToHtml(markdown: string): string {
	return parse(markdown);
}

interface Rule {
	regex: RegExp;
	replacer: StringReplacerFunction | string;
}

function parse(text: string): string {
	// clean input
	text = text
		.replace(/[\b\v\f\r]/g, '')
		.replace(/\\./g, (match) => `&#${match.charCodeAt(1)};`);

	let temp = block(text);

	if (temp === text && !temp.match(/^\s*$/i)) {
		temp = inlineBlock(temp)
			// handle paragraphs
			.replace(/((.|\n)+?)(\n\n+|$)/g, (match, text) => tag('p', text));
	}

	return temp.replace(/&#(\d+);/g, (_, code) =>
		String.fromCharCode(Number.parseInt(code, 10)),
	);
}

/**
 * Process the markdown with the rules provided.
 */
function processMarkdown(
	text: string,
	rules: Rule[],
	parse: ParseMatchFunction,
) {
	for (const rule of rules) {
		const { regex, replacer } = rule;
		const content = regex.exec(text);

		// No content found for the current rule therefore we can move to the next
		// one.
		if (!content) {
			continue;
		}

		// Keep track of where the original content ended in relation to the text
		// provided.
		const endOfContentIndex = content.index + content[0].length;

		const textBeforeHtmlReplacement = parse(text.slice(0, content.index));
		const textAfterHtmlReplacement = parse(text.slice(endOfContentIndex));

		// The replacement text that has been transformed to HTML.
		let htmlReplacement: string;

		if (typeof(replacer) === "string") {
			// String `Replacer`s only support replacing the first digit - like `$1`.
			htmlReplacement = replacer.replace(
				/\$(\d)/g,
				(_, firstDigit) => content[firstDigit],
			);
		} else {
			// With function `Replacer`s the whole match and all content is provided
			const [fullMatch, ...rest] = content;
			htmlReplacement = replacer(fullMatch, ...rest);
		}

		return `${textBeforeHtmlReplacement}${htmlReplacement}${textAfterHtmlReplacement}`;
	}

	// No matches found in loop so we can return the text unchanged.
	return text;
}

function inline(text: string): string {
	return processMarkdown(
		text,
		[
			// - Bold => `**bold**`
			// - Italic => `*italic*` | `_italic_`
			// - Bold and Italic => `**_mixed_**` TODO this doesn't check for
			//   correctly matching tags.
			{
				regex: /([*_]{1,3})((.|\n)+?)\1/g,
				replacer: (_, tokens, content) => {
					tokens = tokens.length;
					content = inline(content);

					if (tokens > 1) {
						content = tag('strong', content);
					}

					if (tokens % 2) {
						content = tag('em', content);
					}

					return content;
				},
			},

			// - Underline => `~underline~`
			// - Strikethrough => `~~strike-through~~`
			// - Delete => `~~~delete~~`
			{
				regex: /(~{1,3})((.|\n)+?)\1/g,
				replacer: (_, tokens, content) =>
					tag(['u', 's', 'del'][tokens.length - 1], inline(content)),
			},

			// - Replace remaining lines with a break tag => `<br />`
			{ regex: / {2}\n|\n {2}/g, replacer: '<br />' },
		],
		inline,
	);
}

function inlineBlock(text = '', shouldInline = true) {
	// A collection of all the tags created so far.
	const gatheredTags: string[] = [];

	function injectInlineBlock(text: string): string {
		return text.replace(/\\(\d+)/g, (match, code) =>
			injectInlineBlock(gatheredTags[Number.parseInt(code, 10) - 1]),
		);
	}

	text = text
		.trim()
		// inline code block
		.replace(
			/`([^`]*)`/g,
			(_, text) => `\\${gatheredTags.push(tag('code', encodeHtml(text)))}`,
		)
		// inline media (a / img / iframe)
		.replace(
			/[!&]?\[([!&]?\[.*?\)|[^\]]*?)]\((.*?)( .*?)?\)|(\w+:\/\/[\w!$'()*+,./-]+)/g,
			(match, text, href, title, link) => {
				if (link) {
					return shouldInline
						? `\\${gatheredTags.push(tag('a', link, { href: link }))}`
						: match;
				}

				if (match[0] === '&') {
					text = text.match(/^(.+),(.+),([^ \]]+)( ?.+?)?$/);
					return `\\${gatheredTags.push(
						tag('iframe', '', {
							width: text[1],
							height: text[2],
							frameborder: text[3],
							class: text[4],
							src: href,
							title,
						}),
					)}`;
				}

				return `\\${gatheredTags.push(
					match[0] === '!'
						? tag('img', '', { src: href, alt: text, title })
						: tag('a', inlineBlock(text, false), { href, title }),
				)}`;
			},
		);

	text = injectInlineBlock(shouldInline ? inline(text) : text);
	return text;
}

function block(text: string) {
	return processMarkdown(
		text,
		[
			// comments
			{ regex: /<!--((.|\n)*?)-->/g, replacer: '<!--$1-->' },

			// pre format block
			{
				regex: /^("""|```)(.*)\n((.*\n)*?)\1/gm,
				replacer: (_, wrapper, classNames, text) =>
					wrapper === '"""'
						? tag('div', parse(text), { class: classNames })
						: tag('pre', tag('code', encodeHtml(text), { class: classNames })),
			},

			// blockquotes
			{
				regex: /(^>.*\n?)+/gm,
				replacer: chain('blockquote', /^> ?(.*)$/gm, '$1', inline),
			},

			// tables
			{
				regex: /((^|\n)\|.+)+/g,
				replacer: chain('table', /^.*(\n\|---.*?)?$/gm, (match, subline) =>
					chain('tr', /\|(-?)([^|]+)\1(\|$)?/gm, (match, type, text) =>
						tag(type || subline ? 'th' : 'td', inlineBlock(text)),
					)(match.slice(0, match.length - (subline || '').length)),
				),
			},

			// lists
			{ regex: /(?:(^|\n)([+-]|\d+\.) +(.*(\n[\t ]+.*)*))+/g, replacer: list },

			//anchor
			{ regex: /#\[([^\]]+?)]/g, replacer: '<a name="$1"></a>' },

			// headlines
			{
				regex: /^(#+) +(.*)$/gm,
				replacer: (_, headerSyntax, headerText) =>
					tag(`h${headerSyntax.length}`, inlineBlock(headerText)),
			},

			// horizontal rule
			{ regex: /^(===+|---+)(?=\s*$)/gm, replacer: '<hr>' },
		],
		parse,
	);
}

type ParseMatchFunction = (match: string) => string;
type StringReplacerFunction = (substring: string, ...args: any[]) => string;

/**
 * Chain string replacement methods and output a function that returns the tag
 * representation of the match.
 */
function chain(
	tagName: string,
	regex: RegExp,
	replacer: string | StringReplacerFunction,
	parser?: ParseMatchFunction,
): ParseMatchFunction {
	return (match: string) => {
		match = match.replace(regex, replacer as string);
		return tag(tagName, parser ? parser(match) : match);
	};
}

/**
 * Handle lists in markdown.
 */
function list(text: string) {
	const wrapperTag = text.match(/^[+-]/m) ? 'ul' : 'ol';

	return text
		? `<${wrapperTag}>${text.replace(
			/(?:[+-]|\d+\.) +(.*)\n?(([\t ].*\n?)*)/g,
			(_, listItemText, childList) =>
				`<li>${inlineBlock(
					`${listItemText}\n${removeIndentation(childList || '').replace(
						/(?:(^|\n)([+-]|\d+\.) +(.*(\n[\t ]+.*)*))+/g,
						list,
					)}`,
				)}</li>`,
		)}</${wrapperTag}>`
		: '';
}

/**
 * Encode html tags within the markdown output.
 */
function encodeHtml(text: string) {
	return text
		? text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		: '';
}

function removeIndentation(text: string) {
	return text.replace(
		new RegExp(`^${(text.match(/^\S?\s+/) || '')[0]}`, 'gm'),
		'',
	);
}

/**
 * Create a tag with the content provided.
 */
function tag(
	tag: string,
	text: string,
	attributes?: Record<string, string>,
): string {
	return `<${tag +
		(attributes
			? ` ${Object.keys(attributes)
				.map((k) =>
					attributes[k] ? `${k}="${encodeHtml(attributes[k]) || ''}"` : '',
				)
				.join(' ')}`
			: '')
		}>${text}</${tag}>`;
}
