# 🎬 Movie Catalog

[![Deployed on Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C58E)](https://movie-catalog-mmsc.netlify.app/)

A modern and responsive movie catalog built with React, TypeScript and Tailwind CSS. Explore movies, search titles and view detailed information including cast.

## 🚀 Live Demo

🎯 **View the live application:** [https://movie-catalog-mmsc.netlify.app/](https://movie-catalog-mmsc.netlify.app/)

*Experience the movie catalog with real-time search, smooth animations, and responsive design!*

## ✨ Features

- 📱 **Responsive Interface**: Adaptive design for desktop, tablet and mobile
- 🔍 **Real-time Search**: Instant filtering based on original title (client-side)
- 🎯 **Details Expansion**: Click cards to view more information and cast
- ⚡ **Optimized Performance**: Lazy loading, search debounce and infinite pagination
- 🎨 **Smooth Animations**: Fluid transitions with CSS animations and Tailwind classes
- 🖼️ **Smart Loading**: Images load only when visible on screen
- 🔄 **Fallback System**: Local JSON backup when API fails (`src/data/movies.json`)
- ⭐ **Your rating**: Rate movies 1–5 stars and add comments; data is stored in the browser (localStorage) per user or anonymously.

## 🚀 Technologies Used

- **React 19** - JavaScript framework for user interfaces
- **TypeScript** - Static typing for greater reliability
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast and modern build tool
- **Heroicons** - Optimized SVG icons
- **Intersection Observer** - Lazy loading for images

## 🏗️ Design Patterns Implemented

### **1. Custom Hooks Pattern**
- **useMovies**: Custom hook that encapsulates all movie state management logic
- **useDebounce**: Reusable hook to control execution frequency
- Logic abstraction for better testability and reusability

### **2. Container/Presentational Pattern**
- **App.tsx**: Container component with business logic and state management
- **MovieCard**: Presentational component focused only on rendering
- Clear separation between logic and presentation layers

### **3. Component Composition Pattern**
- MovieCard structured with internal composition (Header + Expansion sections)
- Modular component design with clear responsibilities
- Easy to extend and maintain

### **4. Lazy Loading Pattern**
- **Intersection Observer**: Image loading only when visible on screen
- **Infinite Scroll**: Progressive data loading with pagination
- Performance optimization for large datasets

### **5. Debounce Pattern**
- Search debouncing to prevent excessive API calls
- Improved user experience with responsive feedback
- Resource optimization for expensive operations

### **6. Typed State with Custom Hooks**
- State encapsulated em hooks customizados (`useMovies`, `useDebounce`)
- Interfaces TypeScript para garantir contratos de dados entre camadas
- Arquitetura pronta para futura adoção de Context API se necessário

## 📋 Minimum Requirements Met ✅

### ✅ Initial List Navigation
- Users can browse through the initial movie list
- Responsive grid layout (2-3 columns depending on screen size)

### ✅ Title Search
- Search field to filter movies by `original_title`
- Filtering happens client-side on the complete dataset
- Search with debounce (300ms) for better performance

### ✅ Details Expansion
- Click any movie to expand information
- Shows cast list (up to 6 main actors)
- Smooth expansion/collapse animation

### ✅ State Toggle
- Second click returns card to normal state
- Fluid transitions between states

## 🏗️ Project Architecture

```
src/
├── components/          # Reusable components
│   ├── MovieCard/       # Main movie card with expansion
│   ├── SearchBar/       # Search field
│   └── LoadingSkeleton/ # Skeleton loading
├── hooks/              # Custom hooks
│   ├── useMovies.ts    # Movie state management
│   └── useDebounce.ts  # Debounce hook
├── services/           # External services
│   ├── movieService.ts # Orchestrator for fetching movies by source
│   ├── templateMovieSourceService.ts # Template for adding new sources
│   ├── tvmazeService.ts # TVMaze API
│   ├── sampleApisService.ts # SampleAPIs
│   ├── ghibliService.ts # Studio Ghibli API
│   └── staticJsonService.ts # Static JSON datasets
├── types/              # TypeScript definitions
│   ├── index.ts        # Movie, PaginatedResponse, DataSource
│   └── apis/           # API-specific types (tvmaze, sampleapis, ghibli, staticJson)
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

## 🛠️ How to Run

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-catalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the project**
   ```bash
   npm run dev
   ```

4. **Access in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Starts development server
- `npm run build` - Creates production build
- `npm run preview` - Preview production build
- `npm run lint` - Run code linting

## 🎯 Technical Decisions

### State Management
- **useMovies**: Custom hook to manage movie state, search and pagination
- Initial loading of all API pages for client-side search
- Separate state for `allMovies` (complete dataset) and `displayedMovies` (filtered/paginated)
- Limite de páginas configurável via constante `MAX_PAGES` em `src/services/movieService.ts` para evitar loops infinitos com APIs mal configuradas

### Performance
- **Lazy Loading**: Images only load when entering viewport
- **Debounce**: Search only executes 300ms after last keystroke
- **Infinite Pagination**: Automatically loads more movies on scroll
- **Skeletons**: Loading states improve perceived performance

### UX/UI
- **Smooth animations**: CSS keyframes and Tailwind transitions para hover, expansão e loading
- **Gradient Backgrounds**: Visually appealing design
- **Responsive Design**: Adaptive grid (1-3 columns)
- **Visual States**: Hover effects and transitions

### API Integration
- **TVMaze API** (`https://api.tvmaze.com`) para catálogo de séries
- **SampleAPIs Movies** (`https://api.sampleapis.com/movies`) para coleções temáticas de filmes
- **Studio Ghibli API** (`https://ghibliapi.vercel.app/films`) para filmes do estúdio Ghibli
- **jsonfakery.com** (legado): Mock API original usada apenas como fallback opcional
- **Error Handling**: Robust network error handling com fallback local em `src/data/movies.json`
- **Type Safety**: TypeScript interfaces para cada API em `src/types/apis/*`

## 📊 Evaluation Criteria

### ✅ Performance
- Lazy loading of images with Intersection Observer
- Search debounce prevents unnecessary requests
- Infinite pagination optimizes initial loading
- Optimized animations com CSS e Tailwind

### ✅ Structure
- Clear separation of responsibilities (components, hooks, services)
- Reusable and well-typed components
- Custom hooks for reusable logic
- Organized folder structure

### ✅ Code Practices
- TypeScript for type safety
- ESLint for code quality
- Functional components with hooks
- Descriptive names and useful comments
- Proper error handling

## 🔧 Development

### Component Structure

**MovieCard**: Main component that displays basic information and expands to show extra details
- LazyImage for optimized poster loading
- Animations com CSS e transições Tailwind
- Toggle expansion com estado interno controlado por React
- Expanded section shows extra details depending on the source:
  - TVMaze: summary, genres, rating, language, year
  - SampleAPIs: IMDb rating, genres, director/actors (via tagline)
  - Ghibli: original Japanese title, description, year, runtime, synthetic \"Ghibli\" genre

**SearchBar**: Search field with icon and modern styling
- Integrated debounce via custom hook
- Responsive design with focus states

**LoadingSkeleton**: Loading component that simulates card structure
- Subtle gradients for better visual perception

### Custom Hooks

**useMovies**: Manages all movie-related state
- Initial data loading
- Client-side filtering
- Infinite pagination

**useDebounce**: Utility to delay executions
- Prevents excessive search during typing

## 🌐 APIs utilizadas

- **TVMaze** (`/shows?page=0`) → mapeado para `Movie` via `tvmazeService.ts`
- **SampleAPIs Movies** (`/movies/animation`) → mapeado para `Movie` via `sampleApisService.ts`
- **Studio Ghibli API** (`/films`) → mapeado para `Movie` via `ghibliService.ts`
- **Static JSON** (`/static-movies.json`) → catálogo de clássicos em `public/`, mapeado via `staticJsonService.ts`
- **jsonfakery.com/movies/paginated** → usado apenas na fonte `jsonfakery` e como fallback legado

## ➕ Adding new public movie sources (no auth)

You can plug additional movie sources that require no authentication. Use `src/services/templateMovieSourceService.ts` as a reference.

### Criteria for a new source

- Accessible via `fetch` (CORS allowed, or same-origin as `/static-movies.json`)
- No API key, token, or authentication
- Returns at least: title, year or date, and some description/summary/tags

### Step-by-step to add a new source

1. **Create a type** in `src/types/apis/` for the raw payload (e.g. `XxxMovie`).
2. **Create a service** in `src/services/` (e.g. `xxxService.ts`):
   - Implement `mapXToMovie(raw: XxxMovie): Movie` to map to the common `Movie` type.
   - Implement `fetchAllMoviesFromX(): Promise<Movie[]>` that fetches the URL and applies the mapper.
3. **Add the source** to `DataSource` in `src/types/index.ts`.
4. **Register the case** in `src/services/movieService.ts` inside the `switch`.
5. **Add a button** in `App.tsx` to the source selector, and update the descriptive label.
6. **Add a mapping test** in `src/services/__tests__/apiMappers.test.ts`.

### Example: static JSON from GitHub

For a JSON file hosted at `https://raw.githubusercontent.com/user/repo/main/movies.json`:

- Create `src/types/apis/staticJson.ts` with an interface matching the JSON structure.
- Create `src/services/staticJsonService.ts` with the mapper and fetcher (set `STATIC_MOVIES_URL` to the raw URL; ensure CORS allows `fetch` from your domain).
- Add `'staticjson'` to `DataSource`, register in `movieService`, and add a button in `App.tsx`.

## 🧪 Como Testar o Sistema de Fallback

### **Método 1: Flag de Teste (Recomendado)**
1. **Edite** `src/services/movieService.ts`
2. **Mude** `const FORCE_FALLBACK = false;` → `true`
3. **Execute** `npm run dev`
4. **Verifique** no console a mensagem: `"API failed, using fallback data..."`
5. **Volte** para `false` após testar

### **Método 2: Simular Offline**
1. **DevTools** → Network → "Offline"
2. **Recarregue** página
3. **Confirme** que os dados locais de `src/data/movies.json` são carregados

### **Método 3: Sem Internet**
1. **Desconecte** internet
2. **Recarregue** app
3. **Verifique** que o app continua funcionando com os dados de `src/data/movies.json`

## 📝 License

This project was developed as part of a technical challenge.

---

**Built with using React, TypeScript and Tailwind CSS**