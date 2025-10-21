export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description });
    }

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage(
                'authorization:github:success:' + JSON.stringify({ token: "${data.access_token}" }),
                window.location.origin
              );
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}
