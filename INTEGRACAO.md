# Integração com o backend (backend-julia)

Este frontend consome a API `backend-julia` (Fastify + Prisma), que fica em
`../../backend-julia` (`C:\Users\mcava\OneDrive\Desktop\backend-julia`).

## Como rodar (2 terminais)

**Terminal 1 — backend**
```bash
cd ../../backend-julia          # ou o caminho completo da pasta backend-julia
npm install
npm run db:migrate              # cria/atualiza as tabelas
npm run db:seed                 # cria o admin + 16 produtos do cardápio
npm run dev                     # API em http://localhost:3389
```

**Terminal 2 — este frontend**
```bash
npm install
npm run dev                     # site em http://localhost:5173
```

O arquivo `.env` define `VITE_API_URL=http://localhost:3389`. Em produção,
troque pela URL pública da API e, no backend, ajuste `CORS_ORIGINS`.

## Contas de teste

| Papel | E-mail | Senha |
|---|---|---|
| Cliente | `ana@lamour.com` | `senha1234` |
| Admin | `admin@julia.dev` | `admin12345` |

(ou crie uma conta nova em **/cadastro**)

## O que foi ligado

| Arquivo | Papel |
|---|---|
| `src/lib/api.js` | Cliente HTTP único (token no `localStorage`, trata erros da API) |
| `src/context/AuthContext.jsx` | Login/cadastro/logout; revalida o token via `GET /me` no boot |
| `src/context/CartContext.jsx` | Carrinho **no backend** (`/cart*`); exige estar logado |
| `src/pages/auth/Login.jsx` `Register.jsx` | Telas `/entrar` e `/cadastro` |
| `src/pages/cart/Cart.jsx` | `/carrinho` — itens, quantidade, total e "Finalizar pedido" (`POST /orders`) |
| `src/pages/my-orders/MyOrders.jsx` | `/meus-pedidos` — histórico (`GET /orders`) |
| `src/pages/products/Products.jsx` | Catálogo agora vem de `GET /products` |
| `src/img/catalog.js` | Mapeia `imageUrl` do backend → imagem local |
| `src/components/Header/Header.jsx` | Ícone de conta (entrar / menu) e carrinho ligados às rotas |

## Fluxo

1. Visitante abre `/produtos` → catálogo carrega da API.
2. Clica em **+ Pedido** sem estar logado → vai para `/entrar`.
3. Depois de logar, **+ Pedido** chama `POST /cart/items`.
4. `/carrinho` → ajusta quantidades → **Finalizar pedido** cria o pedido e esvazia o carrinho.
5. `/meus-pedidos` lista os pedidos do cliente.
