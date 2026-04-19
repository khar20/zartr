import { useEffect, useState } from 'react';
import './Sidepanel.css';

export default function Sidepanel() {
  const [content, setContent] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);

  async function parsePage() {
    setLoading(true);

    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) return;

      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/page-parser.js'],
      });

      if (results && results[0].result && typeof results[0].result === 'string') {
        setContent(results[0].result);
      } else {
        setContent('No readable content found on this page.')
      }
    } catch (error) {
      console.error(error);
      setContent('Error extracting content from this page.')
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    parsePage();
  }, []);

  return (
    <div>
      <h1>zartr</h1>
      <p>Extracted content:</p>
      <button onClick={parsePage}>Extract content</button>
      <button onClick={() => { setContent('') }}>Clear content</button>
      <p>{content}</p>
    </div>
  );
}
