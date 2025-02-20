export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://api.notion.com/v1/databases/1a05c102c987803789dce60294183758',
      {
        headers: {
          'Authorization': `Bearer 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`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}