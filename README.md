# VOS Weather Report App (FM 13 SHIP)

A Progressive Web Application (PWA) designed for Voluntary Observing Ships (VOS) to compile and generate FM 13 SHIP weather reports.

## Features

- **Wizard Interface**: Step-by-step data entry for all FM 13 sections (Identification, Weather, Marine).
- **Code Generation**: Automatically formats data into the correct WMO code string (e.g., `BBXX ...`).
- **Validation**: Ensures mandatory fields are filled and values are within valid ranges.
- **Smart Defaults**: Pre-fills common values and handles optional groups (skipping them by default where appropriate).
- **Offline Capable**: Can be installed as a PWA and used without an internet connection.
- **Review Mode**: Allows editing of specific groups before finalizing the report.

## Usage

1.  **Identification**: Enter ship callsign, date, time, and position.
2.  **Weather Data**: Input observed weather conditions (wind, clouds, temp, pressure, etc.).
3.  **Marine Data**: Input sea conditions (SST, waves, swell, ice). Some groups are skipped by default but can be added in the review phase.
4.  **Review**: Check the generated code. Click "Edit" to modify any group or "Add" to include skipped groups (like Swell or Ice).
5.  **Copy**: Click "Copy to Clipboard" to get the final code string for transmission.

## Technical Details

- **Stack**: HTML5, CSS3, Vanilla JavaScript.
- **Structure**:
    - `index.html`: Main application shell.
    - `style.css`: Styling and layout (CSS Grid/Flexbox).
    - `app.js`: Main controller connecting Store and UI.
    - `store.js`: State management and business logic (Observer pattern).
    - `renderers.js`: Specialized UI rendering logic for complex components.
    - `data.js`: Configuration of the report structure (fields, options, rules).
    - `sw.js`: Service Worker for offline caching.
    - `manifest.json`: PWA manifest.

## Customization

The report structure is defined in `data.js`. You can modify `REPORT_STRUCTURE` to add/remove fields or change validation rules.

## Reference: FM 13 SHIP Data Structure

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

### Section 2: Marine Data
*Starts with `222DsVs`*
14. **222DsVs**: Ship Course & Speed.
15. **0ssTwTwTw**: Sea Surface Temp.
16. **2PwPwHwHw**: Wind Waves.
17. **3dw1dw1dw2dw2**: Swell Direction.
18. **4Pw1Pw1Hw1Hw1**: Primary Swell.
19. **5Pw2Pw2Hw2Hw2**: Secondary Swell.
20. **6IsEsEsRs**: Ice Accretion.
