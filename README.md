# Golden Drop React Frontend

Deployable React.js e-commerce frontend for Golden Drop premium edible oils.

## Stack

- React.js with Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios service layer

## Project Structure

- `src/pages` - separate page files for Home, Products, Product Details, Cart, Checkout, and Not Found
- `src/models` - typed product, order, API models, and product catalog data
- `src/components` - reusable commerce and UI components
- `src/layouts` - shared application shell and navigation
- `src/store` - Redux Toolkit store and slices
- `src/services` - Axios client and API helpers
- `src/hooks` - typed React/Redux hooks
- `src/utils` - small shared utilities

## Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
```

The deployable static output is created in `dist/`.

## Deployment

This project can be deployed on static hosts such as Netlify, Vercel, GitHub
Pages, Firebase Hosting, or any server that can serve the `dist/` folder.

- Build command: `npm run build`
- Publish directory: `dist`
- Optional API variable: `VITE_API_URL=https://your-api-domain.com/api`
