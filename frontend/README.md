# NOVA frontend

    npm install
    cp .env.example .env    # set VITE_API_URL to your backend
    npm run dev             # then open /r/<your-restaurant-slug>

Layers: pages -> components -> hooks -> services (apiClient) -> backend.
Restaurant colors flow: restaurant data -> utils/theme.js -> CSS variables -> UI.
