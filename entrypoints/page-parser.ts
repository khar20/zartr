import { isProbablyReaderable, Readability } from '@mozilla/readability';

export default defineUnlistedScript(() => {
  if (!isProbablyReaderable(window.document, { minContentLength: 100 })) {
    return false;
  }

  try {
    const documentClone = window.document.cloneNode(true) as Document;

    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (!article || !article.textContent) return false;

    return article.textContent?.trim().replace(/\s\s+/g, ' ');
  } catch (error) {
    console.error('[PageParser]', error);
    return false;
  };
});
