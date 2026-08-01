# Page Views Worker

This Worker backs the public page-view counter shown in the site footer.

## Deploy

1. Create a D1 database in Cloudflare:

   ```powershell
   wrangler d1 create bridge-between-engineers-pageviews
   ```

2. Copy `wrangler.toml.example` to `wrangler.toml`, then replace `database_id`.

3. Initialize the table:

   ```powershell
   wrangler d1 execute bridge-between-engineers-pageviews --file schema.sql --remote
   ```

4. Deploy from this directory:

   ```powershell
   wrangler deploy
   ```

5. Add a Cloudflare Worker route for the production domain:

   ```text
   www.bridgezhang.com/api/pageview*
   ```

The frontend calls `/api/pageview` with the current page path. If the Worker is not deployed yet, the counter stays hidden and the page continues to work normally.
