# VOS Weather Report App (FM 13 SHIP)

A Progressive Web App (PWA) for Voluntary Observing Ships (VOS) to prepare and generate FM 13 SHIP weather reports using the World Meteorological Organization (WMO) code format.

## Features

- **Step-by-step entry**: Enter identification, meteorological, and marine observations.
- **Report generation**: Formats the entries as an FM 13 SHIP report (for example, `BBXX ...`).
- **Validation**: Checks required fields and value ranges.
- **Review and editing**: Review the report, edit sections, and add optional sections before copying it.
- **Multiple languages**: The interface is available in English, Spanish, French, Traditional Chinese, Simplified Chinese, and Thai.

## Usage

1. **Identification**: Enter the station ID. Use the vessel's radio call sign only if the station ID is unclear. Enter the observation date, time, and position.
2. **Weather observations**: Enter the observed wind, cloud, temperature, pressure, and weather conditions.
3. **Marine observations**: Enter sea temperature, waves, swell, and ice conditions. Optional sections can be added during review.
4. **Review**: Check the generated report. Edit a section or add any skipped sections as needed.
5. **Copy**: Copy the completed report for transmission.

## Low-Bandwidth / Shipboard Notes

- **Low data use**: The app uses plain HTML, CSS, and JavaScript. Cloud-chart images are loaded when needed.
- **Offline use**: The Service Worker caches core app files during installation. Cloud-chart images are cached after their first successful load, so open any charts you may need offline while connected.
- **Updates**: While online, the app checks for Service Worker updates about every 30 days. An update may reload the app after it is installed.

## Cached Inputs (Saved Settings)

Some inputs are intentionally **cached in the browser (localStorage)** to reduce repeated typing between reports.

- **UI indicator**: Inputs with a subtle green bar on the left are **saved on this device** and will be auto-filled next time.
- **Examples of cached inputs** (may expand over time):
    - Station ID (or vessel call sign when needed), email recipient
    - Wind indicator
    - Humidity measurement mode
    - Sea surface temperature method
    - Pressure step: instrument correction, “Already corrected to MSL?”, keel-to-barometer distance
- **Examples of NOT cached inputs**:
    - Values that change per observation (e.g., time, position, current draft)

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
2.  **CALLSIGN**: Station ID; use the vessel's radio call sign only if the station ID is unclear. The entry is saved in this browser.
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
