import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

const getPrivacyPolicy = async () => {
  const renderer = {
    heading(text: any, level: any) {
      switch (level) {
        case 1:
          return `
            <h${level} class="text-2xl pt-2">
              ${text}
            </h${level}>`;
        case 2:
          return `
            <h${level} class="text-xl pt-2">
              ${text}
            </h${level}>`;
        default:
          return `<h${level} class="text-lg"> ${text} </h${level}>`;
      }
    },
  };

  marked.use({ renderer });
  const markdown = await (
    await fetch(
      'https://raw.githubusercontent.com/lutralabs/documents/main/privacy-policy.md',
      { cache: 'no-store' }
    )
  ).text();
  const { window } = new JSDOM('');
  const purify = DOMPurify(window);
  const html = purify.sanitize(await marked.parse(markdown));
  return html;
};

export default async function Page() {
  const pp = await getPrivacyPolicy();
  return (
    <div
      className="h-full w-full max-w-2xl flex-1 flex-col p-6 sm:p-16"
      dangerouslySetInnerHTML={{ __html: pp }}
    />
  );
}
