# Wind Turbine Map Application

An interactive web application for visualizing and filtering wind turbine data in Denmark. Built with React, TypeScript, and Leaflet.

![Wind Turbine Map](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)

## Features

### 🗺️ Interactive Map
- Interactive map powered by Leaflet.js and OpenStreetMap
- Color-coded markers (by manufacturer, age, or capacity)
- Detailed popups with turbine information
- Smooth pan and zoom controls

### 🔍 Advanced Filtering
- **Manufacturer** - Multi-select filter for turbine manufacturers
- **Local Authority** - Filter by municipality
- **Location Type** - Filter by placement type
- **Type Designation** - Filter by turbine model
- **Capacity Range** - Filter by power output (0-10 MW)
- **Installation Year** - Filter by connection date

### 📊 Statistics & Analytics
- Real-time statistics for filtered data
- Capacity distribution chart
- Installation timeline visualization
- Aggregate metrics (total turbines, capacity, averages)

### 🎨 User Experience
- Responsive design for mobile and desktop
- Toggle filters and statistics panels
- Live turbine count
- Fast filtering with optimized performance

## Prerequisites

- Node.js 18+ and npm
- Running MasterData Importer API (backend)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure the API endpoint**:
   Create a `.env` file (or copy from `.env.example`):
   ```bash
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Structure

```
wind-turbine-map/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── TurbineMap.tsx      # Main map component
│   │   │   └── TurbineMap.css      # Map styles
│   │   ├── Filters/
│   │   │   ├── FilterPanel.tsx     # Filter controls
│   │   │   └── FilterPanel.css     # Filter styles
│   │   └── Statistics/
│   │       ├── StatsPanel.tsx      # Statistics dashboard
│   │       └── StatsPanel.css      # Stats styles
│   ├── hooks/
│   │   ├── useTurbines.ts          # Data fetching hook
│   │   └── useFilters.ts           # Filter management hook
│   ├── services/
│   │   └── api.ts                  # API client
│   ├── types/
│   │   └── turbine.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── filterTurbines.ts       # Filter logic
│   │   └── mapHelpers.ts           # Map utilities
│   ├── App.tsx                     # Main application
│   ├── App.css                     # App styles
│   └── main.tsx                    # Entry point
├── public/                         # Static assets
├── .env                           # Environment variables
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── vite.config.ts                # Vite config
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **Leaflet.js** - Interactive maps
- **React-Leaflet** - React bindings for Leaflet
- **Chart.js** - Data visualization
- **React-ChartJS-2** - React wrapper for Chart.js

## API Integration

The application connects to the MasterData Importer API backend. Ensure the API is running before starting the frontend.

### API Endpoints Used

- `GET /api/windturbines` - Fetch all turbines
- `GET /api/windturbines/stats` - Get statistics
- `GET /api/windturbines/gsrn/{gsrn}` - Get single turbine
- `GET /api/windturbines/manufacturer/{name}` - Filter by manufacturer

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |

## Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Deploy**:
   The `dist` folder contains the production build. Deploy to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront
   - Any web server (nginx, Apache)

## Features in Detail

### Color Coding

Markers can be colored by:
- **Manufacturer** - Different color for each manufacturer
- **Age** - Gradient from new (green) to old (red)
- **Capacity** - Gradient from small (red) to large (green)

### Filtering Logic

Filters work with AND logic:
- All selected manufacturers OR
- All selected authorities OR
- All selected location types OR
- All selected type designations OR
- Within capacity range AND
- Within year range

### Performance

- Optimized rendering with React.memo
- Debounced filter updates
- Efficient data structures
- Lazy loading for large datasets

## Troubleshooting

### Map not loading
- Check that Leaflet CSS is imported
- Verify internet connection (for map tiles)
- Check browser console for errors

### No data showing
- Ensure the backend API is running
- Verify `VITE_API_URL` in `.env`
- Check network tab for failed requests
- Confirm CORS is enabled on the backend

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend API documentation
3. Open an issue on GitHub
