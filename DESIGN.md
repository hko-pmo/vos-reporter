# VOS Weather Report App - Design Document

## Overview
A lightweight, offline-capable Progressive Web App (PWA) to assist Voluntary Observation Ships (VOS) in compiling FM 13 SHIP weather reports. The app generates a code string for the user to copy and email via satellite connection.

## Core Requirements
1.  **Offline First**: Must work without internet access (Service Worker).
2.  **Manual Input**: All data, including geolocation and time, is manually entered.
3.  **Wizard Interface**: Step-by-step process, one code group per screen.
4.  **Code Tables**: Dropdowns with descriptions for complex codes (e.g., "1: Increasing then steady").
5.  **Review & Edit**: Ability to review the final string and jump back to edit specific groups.

## Data Structure (FM 13 SHIP)

The report is constructed of 5-character groups.

### Section 0: Identification (Mandatory)
1.  **BBXX**: Fixed identifier.
2.  **CALLSIGN**: Ship's callsign (Saved in local storage).
3.  **YYGGiw**:
    *   `YY`: Day of month (01-31).
    *   `GG`: Hour (00, 06, 12, 18, etc.).
    *   `iw`: Wind speed indicator (Default/Selectable).
4.  **99LaLaLa**: Latitude.
    *   `99`: Fixed.
    *   `LaLaLa`: Lat x 10.
5.  **QcLoLoLoLo**: Longitude.
    *   `Qc`: Quadrant (1=NE, 3=SE, 5=SW, 7=NW).
    *   `LoLoLoLo`: Long x 10.

### Section 1: Meteorological Data
6.  **4ixhVV**: Precipitation/Cloud Base/Visibility.
7.  **Nddff**: Cloud Cover/Wind.
8.  **1snTTT**: Air Temperature.
9.  **2snTdTdTd**: Dew Point.
10. **4PPPP**: Pressure.
11. **5appp**: Pressure Tendency.
12. **7wwW1W2**: Present & Past Weather.
13. **8NhCLCMCH**: Cloud Types.

### Section 2: Marine Data (Optional)
*Starts with `222DsVs`*
14. **222DsVs**: Ship Course & Speed.
15. **0ssTwTwTw**: Sea Surface Temp.
16. **2PwPwHwHw**: Wind Waves.
17. **3dw1dw1dw2dw2**: Swell Direction.
18. **4Pw1Pw1Hw1Hw1**: Primary Swell.
19. **5Pw2Pw2Hw2Hw2**: Secondary Swell.
20. **6IsEsEsRs**: Ice Accretion.

## UI Flow

### 1. Start Screen
*   Input/Confirm `CALLSIGN`.
*   "Start New Report" button.

### 2. Wizard Screens (Repeated for each group)
*   **Title**: Group Name (e.g., "Pressure Tendency").
*   **Inputs**:
    *   Number fields (with numeric keypad trigger).
    *   Dropdowns (for coded values).
*   **Preview**: Live update of the 5-char code (e.g., `52003`).
*   **Navigation**:
    *   `[Back]`: Go to previous group.
    *   `[Skip]`: Only visible if group is optional.
    *   `[Next]`: Go to next group.

### 3. Review Screen
*   Display full generated string.
*   List of groups with values.
*   "Edit" button next to each group -> Jumps to that Wizard screen.
*   "Copy to Clipboard" button.

### 4. Edit Mode
*   When jumping back from Review, the `[Next]` button becomes `[Return to Review]`.

## Technical Stack
*   **HTML5/CSS3**: Simple, responsive layout.
*   **JavaScript (Vanilla)**: No heavy frameworks to keep it lightweight.
*   **Service Worker**: For offline caching.
*   **LocalStorage**: To save `CALLSIGN` and potentially draft reports.

## Implementation Plan
1.  `data.js`: Define the schema for all groups (labels, input types, options).
2.  `store.js`: Centralized state management and report generation logic.
3.  `renderers.js`: Handle DOM creation for complex inputs (Position, Swell, etc.).
4.  `app.js`: Controller to bind the Store to the UI and handle navigation.
5.  `index.html`: Container for the dynamic content.
6.  `style.css`: Basic styling for readability and touch targets.
