import { useEffect, useState } from 'react';
import { AI_PROVIDERS } from '../../lib/constants';

export default function OptionsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSettings() {
      const savedKeys = await storage.getItem<Record<string, string>>('local:apiKeys');
      if (savedKeys) {
        setKeys(savedKeys);
        console.log(savedKeys);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (id: string, value: string) => {
    setKeys((prevKeys) => ({ ...prevKeys, [id]: value }));
  }

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await storage.setItem('local:apiKeys', keys);
  }

  return (
    <div>
      <header>
        <h1>zartr</h1>
      </header>
      <section>
        <h2>API Credentials</h2>
        <form onSubmit={handleSave}>
          {AI_PROVIDERS.map((provider) => (
            <div key={provider.id}>
              <label htmlFor={provider.id}>{provider.label}</label>
              <input
                id={provider.id}
                type='password'
                placeholder={provider.placeholder}
                onChange={(e) => handleChange(provider.id, e.target.value)}
                value={keys[provider.id] || ''}>
              </input>
            </div>
          ))}

          <div>
            <button type='submit'>Save</button>
          </div>
        </form>
      </section>
    </div>
  );
}
