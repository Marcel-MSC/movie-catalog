# 🎬 Movie Catalog

A modern and responsive movie catalog built with React, TypeScript and Tailwind CSS. Explore movies, search titles and view detailed information including cast.

## ✨ Features

- 📱 **Responsive Interface**: Adaptive design for desktop, tablet and mobile
- 🔍 **Real-time Search**: Instant filtering based on original title (client-side)
- 🎯 **Details Expansion**: Click cards to view more information and cast
- ⚡ **Optimized Performance**: Lazy loading, search debounce and infinite pagination
- 🎨 **Smooth Animations**: Fluid transitions with Framer Motion
- 🖼️ **Smart Loading**: Images load only when visible on screen
- 🔄 **Fallback System**: Local JSON backup when API fails

## 🚀 Technologies Used

- **React 19** - JavaScript framework for user interfaces
- **TypeScript** - Static typing for greater reliability
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast and modern build tool
- **Framer Motion** - Animation library
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

### **6. Context API Pattern (Architectural)**
- MoviesContext prepared for future state sharing needs
- Typed interfaces for better TypeScript support
- Extensible architecture for global state management

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
│   └── movieService.ts # API for fetching movies
├── types/              # TypeScript definitions
│   └── index.ts        # Movie and PaginatedResponse interfaces
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

### Performance
- **Lazy Loading**: Images only load when entering viewport
- **Debounce**: Search only executes 300ms after last keystroke
- **Infinite Pagination**: Automatically loads more movies on scroll
- **Skeletons**: Loading states improve perceived performance

### UX/UI
- **Framer Motion**: Smooth animations for hover, expansion and loading
- **Gradient Backgrounds**: Visually appealing design
- **Responsive Design**: Adaptive grid (1-3 columns)
- **Visual States**: Hover effects and transitions

### API Integration
- **jsonfakery.com**: Mock API for paginated movie data
- **Error Handling**: Robust network error handling
- **Type Safety**: TypeScript interfaces for all data

## 📊 Evaluation Criteria

### ✅ Performance
- Lazy loading of images with Intersection Observer
- Search debounce prevents unnecessary requests
- Infinite pagination optimizes initial loading
- Optimized animations with Framer Motion

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

**MovieCard**: Main component that displays basic information and expands to show cast
- LazyImage for optimized poster loading
- Animations with Framer Motion
- Toggle expansion with AnimatePresence

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

## 🌐 API

The project uses the mock API [jsonfakery.com/movies/paginated](https://jsonfakery.com/movies/paginated) which returns:

```typescript
interface Movie {
  id: string;
  original_title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  casts?: Array<{ id: string; name: string }>;
  // ... other fields
}
```

## 🧪 Como Testar o Sistema de Fallback

### **Método 1: Flag de Teste (Recomendado)**
1. **Edite** `src/services/movieService.ts`
2. **Mude** `const FORCE_FALLBACK = false;` → `true`
3. **Execute** `npm run dev`
4. **Verifique** console: `"API failed, using fallback data..."`
5. **Volte** para `false` após testar

### **Método 2: Simular Offline**
1. **DevTools** → Network → "Offline"
2. **Recarregue** página
3. **Confirme** dados locais carregam

### **Método 3: Sem Internet**
1. **Desconecte** internet
2. **Recarregue** app
3. **Verifique** funcionamento offline

## 📝 License

This project was developed as part of a technical challenge.

---

**Built with using React, TypeScript and Tailwind CSS**