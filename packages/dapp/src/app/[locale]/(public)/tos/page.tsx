import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

const getTos = async () => {
  const renderer = {
    heading(text: string, level: number) {
      switch (level) {
        case 1:
          return `
            <h${level} class="text-2xl font-bold text-center items-center justify-center pt-2">
              ${text}
            </h${level}>`;
        case 2:
          return `
            <h${level} class="text-xl font-bold pt-8 pb-2">
              ${text}
            </h${level}>`;
        default:
          return `<h${level} class="text-lg"> ${text} </h${level}>`;
      }
    },
    blockquote(text: string) {
      return `<div class="w-full flex items-center justify-center"><blockquote class="bg-pink-500 rounded-full text-center dark:bg-orange-accent-dark dark:text-navy-blue-900 w-auto inline-block text-white px-4 my-4">${text}</blockquote></div>`;
    },
    paragraph(text: string) {
      return `<p class="text-justify">${text}</p>`;
    },
    link(href: string, title: string | null | undefined, text: string) {
      return `<a class="text-pink-500 dark:text-orange-accent-dark" href="${href}" title="${title}">${text}</a>`;
    },
  };

  marked.use({ renderer });
  const markdown = await (
    await fetch(
      'https://raw.githubusercontent.com/lutralabs/documents/main/ToS.md',
      { cache: 'no-store' }
    )
  ).text();
  const { window } = new JSDOM('');
  const purify = DOMPurify(window);
  const html = purify.sanitize(await marked.parse(markdown));

  return html;
};

export default async function Page() {
  const tos = await getTos();
  return (
    <div
      className="h-full w-full max-w-4xl flex-1 flex-col p-6 sm:p-16"
      dangerouslySetInnerHTML={{ __html: tos }}
    />
  );
}
