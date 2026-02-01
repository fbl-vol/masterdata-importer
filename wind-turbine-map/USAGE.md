# Wind Turbine Map - Usage Guide

This guide explains how to use the Wind Turbine Map application to visualize and filter wind turbine data.

## Getting Started

### Prerequisites
1. Ensure the backend API is running (see main README.md)
2. Start the frontend application:
   ```bash
   cd wind-turbine-map
   npm install
   npm run dev
   ```
3. Open http://localhost:5173 in your browser

## User Interface Overview

The application consists of four main sections:

### 1. Header Bar
- **Title and Description** - Shows the application name
- **Color By Selector** - Choose how to color-code map markers:
  - **Manufacturer** - Different color for each manufacturer
  - **Age** - Green (new) to red (old) gradient
  - **Capacity** - Red (small) to green (large) gradient
- **Toggle Buttons** - Show/hide filters and statistics panels

### 2. Filter Panel (Left Sidebar)

#### Available Filters

**Manufacturer Filter**
- Multi-select checkboxes for turbine manufacturers
- Shows top 10 manufacturers by default
- Click "Show X more..." to see all manufacturers

**Local Authority Filter**
- Multi-select checkboxes for municipalities
- Filter turbines by geographic location (kommune)

**Location Type Filter**
- Filter by placement type (e.g., onshore, offshore)
- All available types shown

**Type Designation Filter**
- Multi-select checkboxes for turbine models
- Shows top 10 models by default
- Useful for finding specific turbine types

**Capacity Range Filter**
- Enter minimum and maximum capacity in MW
- Default range: 0-10 MW
- Use 0.5 MW increments

**Installation Year Filter**
- Enter minimum and maximum years
- Default: Last 10 years
- Range from 1980 to current year

**Reset All Button**
- Appears when filters are active
- Clears all filters and returns to showing all turbines

### 3. Interactive Map (Center)

#### Map Features
- **Pan** - Click and drag to move around the map
- **Zoom** - Use mouse wheel or +/- buttons
- **Markers** - Each marker represents a wind turbine
- **Colors** - Markers are color-coded based on your selection

#### Marker Popups
Click any marker to see detailed information:
- Manufacturer and model
- GSRN number (unique identifier)
- Capacity in MW or kW
- Hub height and rotor diameter
- Location (municipality)
- Placement type
- Connection date
- Decommissioning date (if applicable)

#### Turbine Count
- Displayed above the map
- Shows filtered count vs. total count
- Example: "Showing 245 of 1,523 turbines"

### 4. Statistics Panel (Bottom)

#### Summary Cards
Five colorful cards showing:
1. **Total Turbines** - Number of filtered turbines (of total)
2. **Total Capacity** - Combined capacity in MW
3. **Average Capacity** - Mean capacity in kW
4. **Manufacturers** - Number of unique manufacturers
5. **Model Types** - Number of unique turbine models

#### Charts

**Capacity Distribution Chart**
- Bar chart showing turbines grouped by capacity
- Categories: <1MW, 1-2MW, 2-3MW, 3-4MW, 4-5MW, 5-6MW, 6+MW
- Y-axis shows number of turbines

**Installation Timeline Chart**
- Bar chart showing installations by year
- X-axis shows years
- Y-axis shows number of installations
- Helps identify trends over time

## Common Use Cases

### Find All Turbines by a Specific Manufacturer
1. In the Filter Panel, scroll to "Manufacturer"
2. Check the box next to the desired manufacturer
3. Map and statistics update automatically

### View Large Capacity Turbines
1. In "Capacity Range", set minimum to 3 MW
2. Set maximum to 10 MW
3. See only turbines 3MW and above

### See Recently Installed Turbines
1. In "Installation Year", set minimum to current year - 2
2. Set maximum to current year
3. View turbines installed in last 2 years

### Compare Two Manufacturers
1. Check boxes for two manufacturers
2. Use "Color by: Manufacturer" to see them in different colors
3. Compare distribution on map and in charts

### Find Offshore Wind Turbines
1. In "Location Type", select appropriate offshore category
2. View only offshore installations

### Analyze Turbines in a Specific Region
1. In "Local Authority", select the municipality
2. View all turbines in that area
3. Check statistics for regional insights

## Tips and Tricks

### Performance
- The application loads up to 10,000 turbines efficiently
- Filters apply instantly without page reload
- Charts update in real-time

### Combining Filters
- All filters work together with AND logic
- Example: You can filter for:
  - Manufacturer: "Vestas" AND
  - Capacity: 3-5 MW AND
  - Year: 2015-2020 AND
  - Location: "København"

### Keyboard Navigation
- Tab through filter checkboxes
- Space to toggle checkboxes
- Enter in number fields to apply

### Mobile Use
- Application is responsive
- Filter panel collapses on mobile
- Use toggle buttons to show/hide panels
- Map is touch-enabled (pinch to zoom)

## Error Messages

### "Error Loading Data"
**Cause**: Backend API is not running or not accessible

**Solution**:
1. Check if backend is running: `docker compose ps`
2. Start backend if needed: `docker compose up`
3. Verify API URL in `.env` file
4. Check browser console for detailed error

### "Failed to fetch"
**Cause**: Network connection issue or CORS problem

**Solution**:
1. Check internet connection
2. Verify backend CORS settings allow frontend domain
3. Check browser developer tools network tab

### No Markers Showing
**Cause**: 
- No turbines match current filters
- All turbines lack coordinate data
- Filters too restrictive

**Solution**:
1. Click "Reset All" to clear filters
2. Gradually add filters back
3. Check turbine count above map

## Technical Details

### Data Refresh
- Data loads once on application start
- To refresh, reload the page (F5)
- Backend changes require page reload

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Map Tiles
- Uses OpenStreetMap (free, open-source)
- Requires internet connection
- Cached by browser for performance

## Troubleshooting

**Map not loading tiles**
- Check internet connection
- Clear browser cache
- Try different network

**Slow performance**
- Too many markers visible
- Apply filters to reduce count
- Close other browser tabs
- Use modern browser

**Filters not working**
- Check browser console for errors
- Reload page
- Clear browser cache

**Charts not displaying**
- Ensure filtered data exists
- Check for JavaScript errors
- Try different browser

## Support

For additional help:
1. Check main README.md
2. Review API documentation at /scalar/v1
3. Report issues on GitHub
