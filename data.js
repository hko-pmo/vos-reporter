const REPORT_STRUCTURE = [
    // --- SECTION 0: IDENTIFICATION ---
    {
        id: 'identification',
        name: 'Identification',
        description: "This webpage is designed for Voluntary Observing Ships to compile FM13 SHIP weather reports. Follow the steps to complete the reports. Some steps can be skipped. At the end you will be redirected to send the report via email. When reloading the page, some settings, such as call sign, are automatically loaded. For any suggestions and feedbacks, please send them to hkopmo@hko.gov.hk (this is NOT the report recipient address).",
        section: 0,
        mandatory: true,
        fields: [
            { id: 'bbxx', type: 'static', value: 'BBXX ', label: 'Report Type' },
            { id: 'callsign', type: 'text', label: 'Call Sign', width: 0, uppercase: true, persist: true },
            { id: 'email_recipient', type: 'text', label: 'Email Recipient of Weather Report', width: 0, persist: true, excludeFromCode: true }
        ]
    },
    {
        id: 'datetime',
        name: 'Observation Date & Time',
        section: 0,
        mandatory: true,
        fields: [
            { id: 'day', type: 'number', label: 'Day of Month', min: 1, max: 31, width: 2, pad: true },
            { id: 'hour', type: 'number', label: 'Hour in UTC', min: 0, max: 23, width: 2, pad: true },
            { 
                id: 'wind_indicator', 
                type: 'select', 
                label: 'Wind Indicator (iw)', 
                width: 1,
                persist: true,
                options: [
                    { value: '3', label: '3: Speed estimated (knots)' },
                    { value: '4', label: '4: Speed measured (knots)' },
                    // { value: '1', label: '1: Speed estimated (m/s)' },
                    // { value: '0', label: '0: Speed measured (m/s)' }
                ]
            }
        ]
    },
    {
        id: 'position',
        name: 'Position and Ship Course',
        section: 0,
        mandatory: true,
        customComponent: 'position-input',
        fields: [
            // Latitude Group: 99LaLaLa
            { id: 'indicator_99', type: 'static', value: '99', label: 'Latitude Indicator', hidden: true },
            { id: 'lat_final', type: 'computed', width: 3, pad: true, label: 'Latitude' },
            
            // Spacer
            { id: 'pos_spacer_final', type: 'static', value: ' ' },

            // Longitude Group: QcLoLoLoLo
            { id: 'quadrant_final', type: 'computed', width: 1, label: 'Quadrant' },
            { id: 'long_final', type: 'computed', width: 4, pad: true, label: 'Longitude' },

            // Spacer
            { id: 'marine_spacer', type: 'static', value: ' ' },

            // Ship Course & Speed Group: 222DsVs
            { id: 'indicator_222', type: 'static', value: '222', label: 'Indicator', hidden: true },
            { 
                id: 'course', 
                type: 'select', 
                label: 'Ship Course (Ds)', 
                width: 1,
                default: '/',
                options: [
                    { value: '/', label: '/: Not determined' },
                    { value: '0', label: '0: Stationary' },
                    { value: '1', label: '1: NE' },
                    { value: '2', label: '2: E' },
                    { value: '3', label: '3: SE' },
                    { value: '4', label: '4: S' },
                    { value: '5', label: '5: SW' },
                    { value: '6', label: '6: W' },
                    { value: '7', label: '7: NW' },
                    { value: '8', label: '8: N' },
                    { value: '9', label: '9: Unknown' }
                ]
            },
            { 
                id: 'speed', 
                type: 'select', 
                label: 'Ship Speed (Vs)', 
                width: 1,
                default: '/',
                options: [
                    { value: '/', label: '/: Not determined' },
                    { value: '0', label: '0: 0 knots' },
                    { value: '1', label: '1: 1-5 knots' },
                    { value: '2', label: '2: 6-10 knots' },
                    { value: '3', label: '3: 11-15 knots' },
                    { value: '4', label: '4: 16-20 knots' },
                    { value: '5', label: '5: 21-25 knots' },
                    { value: '6', label: '6: 26-30 knots' },
                    { value: '7', label: '7: 31-35 knots' },
                    { value: '8', label: '8: 36-40 knots' },
                    { value: '9', label: '9: >40 knots' }
                ]
            }
        ]
    },

    // --- SECTION 1: METEOROLOGICAL DATA ---
    {
        id: 'precip_vis',
        name: 'Cloud Base and Visibility',
        section: 1,
        mandatory: true, 
        fields: [
            { id: 'indicator_4', type: 'static', value: '4', label: 'Precipitation Indicator (Fixed)', hidden: true },
            { 
                id: 'weather_indicator', 
                type: 'select', 
                label: 'Weather Data Indicator (ix)', 
                width: 1,
                options: [
                    { value: '1', label: '1: Weather data included (to be input later)' },
                    { value: '2', label: '2: Weather data omitted' }
                ]
            },
            { 
                id: 'cloud_base', 
                type: 'select', 
                label: 'Visual Estimate of Height of Cloud Base (h)', 
                width: 1,
                default: '/',
                help: '0-7: <6500ft (Cu, St, Sc, Cb, Ns). 8-9: >6500ft (As, Ac, Ns) or >8200ft (Ci, Cs, Cc). /: Obscured or unknown.',
                options: [
                    { value: '0', label: '0: 0 to 50m' },
                    { value: '1', label: '1: 50 to 100m' },
                    { value: '2', label: '2: 100 to 200m' },
                    { value: '3', label: '3: 200 to 300m' },
                    { value: '4', label: '4: 300 to 600m' },
                    { value: '5', label: '5: 600 to 1000m' },
                    { value: '6', label: '6: 1000 to 1500m' },
                    { value: '7', label: '7: 1500 to 2000m' },
                    { value: '8', label: '8: 2000 to 2500m' },
                    { value: '9', label: '9: > 2500m or no clouds' },
                    { value: '/', label: '/: Unknown/Obscured' }
                ]
            },
            { 
                id: 'visibility', 
                type: 'select', 
                label: 'Visibility Code (VV)', 
                width: 2, 
                default: '99',
                options: [
                    { value: '90', label: '90: < 50 m' },
                    { value: '91', label: '91: 50 to < 200 m' },
                    { value: '92', label: '92: 200 to < 500 m' },
                    { value: '93', label: '93: 500 to < 1000 m' },
                    { value: '94', label: '94: 1 to < 2 km' },
                    { value: '95', label: '95: 2 to < 4 km' },
                    { value: '96', label: '96: 4 to < 10 km' },
                    { value: '97', label: '97: 10 to < 20 km' },
                    { value: '98', label: '98: 20 to < 50 km' },
                    { value: '99', label: '99: ≥ 50 km' }
                ]
            } 
        ]
    },
    {
        id: 'wind',
        name: 'Wind',
        section: 1,
        mandatory: true,
        customComponent: 'wind-input',
        fields: [
            { 
                id: 'cloud_cover', 
                type: 'text', 
                label: 'Total Cloud Cover (N)', 
                hidden: true,
                default: '/'
            },
            { 
                id: 'wind_dir', 
                type: 'number', 
                label: 'True Wind Direction (dd) [Tens of degrees]', 
                min: 0, 
                max: 99, 
                width: 2, 
                pad: true,
                help: '0: Calm, 99: Variable. Otherwise nearest 10 (e.g. 094° -> 9, 276° -> 28, 356° -> 36, 4° -> 36)'
            },
            {
                id: 'wind_speed',
                type: 'number',
                label: 'True Wind Speed (ff) [0 - 98 Knots]',
                min: 0,
                max: 98,
                width: 2, 
                pad: true }
        ]
    },
    {
        id: 'temp_humidity',
        name: 'Temperature & Humidity',
        section: 1,
        mandatory: false,
        customComponent: 'temp-humidity-input',
        fields: [
            { id: 'temp_humidity_code', type: 'computed', label: 'Code' }
        ]
    },
    {
        id: 'pressure_tendency_combined',
        name: 'Mean Sea Level Pressure & Tendency',
        section: 1,
        mandatory: false,
        customComponent: 'pressure-tendency-input',
        fields: [
            { id: 'pressure_tendency_code', type: 'computed', label: 'Code' },
            { id: 'pt_correction', type: 'number', label: 'Barometer Correction', hidden: true, persist: true, excludeFromCode: true },
            { id: 'pt_height', type: 'number', label: 'Height of Barometer', hidden: true, excludeFromCode: true }
        ]
    },
    {
        id: 'present_past_weather',
        name: 'Present & Past Weather',
        section: 1,
        mandatory: false,
        customComponent: 'present-weather-input',
        fields: [
            { id: 'indicator_7', type: 'static', value: '7', label: 'Indicator', hidden: true },
            { 
                id: 'present_weather', 
                type: 'select', 
                label: 'Present Weather (ww)', 
                width: 2, 
                pad: true, 
                default: '//',
                help: 'Select the most severe weather condition observed. For detail, refer to WMO code table 4677.'
            },
            { 
                id: 'past_weather_1', 
                type: 'select', 
                label: 'Past Weather 1 (W1)', 
                width: 1, 
                default: '/',
                help: 'W1 is always larger than W2',
                options: [
                    { value: '9', label: '9: Thunderstorm(s)' },
                    { value: '8', label: '8: Shower(s)' },
                    { value: '7', label: '7: Snow, or rain and snow mixed' },
                    { value: '6', label: '6: Rain' },
                    { value: '5', label: '5: Drizzle' },
                    { value: '4', label: '4: Fog, ice fog, or thick haze' },
                    { value: '3', label: '3: Sandstorm, duststorm, or blowing snow' },
                    { value: '2', label: '2: Cloud cover > 1/2 throughout period' },
                    { value: '1', label: '1: Cloud cover > 1/2 part of period' },
                    { value: '0', label: '0: Cloud cover <= 1/2 throughout period' },
                    { value: '/', label: '/: Unknown or not determined' }
                ]
            },
            { 
                id: 'past_weather_2', 
                type: 'select', 
                label: 'Past Weather 2 (W2)', 
                width: 1, 
                default: '/',
                help: 'W1 is always larger than W2',
                options: [
                    { value: '9', label: '9: Thunderstorm(s)' },
                    { value: '8', label: '8: Shower(s)' },
                    { value: '7', label: '7: Snow, or rain and snow mixed' },
                    { value: '6', label: '6: Rain' },
                    { value: '5', label: '5: Drizzle' },
                    { value: '4', label: '4: Fog, ice fog, or thick haze' },
                    { value: '3', label: '3: Sandstorm, duststorm, or blowing snow' },
                    { value: '2', label: '2: Cloud cover > 1/2 throughout period' },
                    { value: '1', label: '1: Cloud cover > 1/2 part of period' },
                    { value: '0', label: '0: Cloud cover <= 1/2 throughout period' },
                    { value: '/', label: '/: Unknown or not determined' }
                ]
            }
        ]
    },
    {
        id: 'cloud_types',
        name: 'Cloud Types',
        section: 1,
        mandatory: false,
        fields: [
            { id: 'indicator_8', type: 'static', value: '8', label: 'Indicator', hidden: true },
            { 
                id: 'cloud_cover', 
                type: 'select', 
                label: 'Total Cloud Cover (N)', 
                width: 1,
                excludeFromCode: true,
                options: [
                    { value: '0', label: '0: 0 oktas (Clear)' },
                    { value: '1', label: '1: 1 okta or less' },
                    { value: '2', label: '2: 2 oktas' },
                    { value: '3', label: '3: 3 oktas' },
                    { value: '4', label: '4: 4 oktas' },
                    { value: '5', label: '5: 5 oktas' },
                    { value: '6', label: '6: 6 oktas' },
                    { value: '7', label: '7: 7 oktas' },
                    { value: '8', label: '8: 8 oktas (Overcast)' },
                    { value: '9', label: '9: Sky obscured by fog, snow, etc' },
                    { value: '/', label: '/: Indiscernible or no observation' }
                ]
            },
            { 
                id: 'low_cloud_amount', 
                type: 'select', 
                label: 'Amount of Low/Middle Clouds (Nh)', 
                width: 1,
                default: '/',
                options: [
                    { value: '0', label: '0: 0 oktas' },
                    { value: '1', label: '1: 1 okta or less' },
                    { value: '2', label: '2: 2 oktas' },
                    { value: '3', label: '3: 3 oktas' },
                    { value: '4', label: '4: 4 oktas' },
                    { value: '5', label: '5: 5 oktas' },
                    { value: '6', label: '6: 6 oktas' },
                    { value: '7', label: '7: 7 oktas' },
                    { value: '8', label: '8: 8 oktas' },
                    { value: '/', label: '/: Unknown or not determined' }
                ]
            },
            { 
                id: 'low_cloud_type', 
                type: 'select', 
                label: 'Low Cloud Type (CL)', 
                width: 1, 
                default: '/',
                cloudType: 'low',
                options: [
                    { value: '0', label: '0' },
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6' },
                    { value: '7', label: '7' },
                    { value: '8', label: '8' },
                    { value: '9', label: '9' },
                    { value: '/', label: '/' }
                ]
            },
            { 
                id: 'mid_cloud_type', 
                type: 'select', 
                label: 'Middle Cloud Type (CM)', 
                width: 1, 
                default: '/',
                cloudType: 'mid',
                options: [
                    { value: '0', label: '0' },
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6' },
                    { value: '7', label: '7' },
                    { value: '8', label: '8' },
                    { value: '9', label: '9' },
                    { value: '/', label: '/' }
                ]
            },
            { 
                id: 'high_cloud_type', 
                type: 'select', 
                label: 'High Cloud Type (CH)', 
                width: 1, 
                default: '/',
                cloudType: 'high',
                options: [
                    { value: '0', label: '0' },
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6' },
                    { value: '7', label: '7' },
                    { value: '8', label: '8' },
                    { value: '9', label: '9' },
                    { value: '/', label: '/' }
                ]
            }
        ]
    },
    
    // --- SECTION 2: MARINE DATA ---
    {
        id: 'sea_temp',
        name: 'Sea Surface Temperature',
        section: 2,
        mandatory: false,
        customComponent: 'sea-temp-input',
        fields: [
            { id: 'sea_temp_code', type: 'computed', label: 'Code' }
        ]
    },
    {
        id: 'wind_waves',
        name: 'Wind Waves',
        section: 2,
        mandatory: false,
        customComponent: 'wind-waves-input',
        fields: [
            { id: 'wind_waves_code', type: 'computed', label: 'Code' }
        ]
    },
    {
        id: 'swell_data',
        name: 'Swell Waves',
        section: 2,
        mandatory: false,
        customComponent: 'swell-input',
        fields: [
            { id: 'swell_code', type: 'computed', label: 'Code' }
        ]
    },
    {
        id: 'ice_accretion',
        name: 'Ice Accretion',
        section: 2,
        mandatory: false,
        customComponent: 'ice-accretion-input',
        fields: [
            { id: 'ice_accretion_code', type: 'computed', label: 'Code' }
        ]
    },
    {
        id: 'ice_data',
        name: 'Sea Ice',
        section: 2,
        mandatory: false,
        fields: [
            { id: 'indicator_ice', type: 'static', value: 'ICE ', label: 'Indicator', hidden: true },
            { 
                id: 'ice_conc', 
                type: 'select', 
                label: 'Concentration (ci)', 
                width: 1,
                default: '/',
                options: [
                    { value: '0', label: '0: No sea ice' },
                    { value: '1', label: '1: Ship in open water' },
                    { value: '2', label: '2: 1/10 to 3/10' },
                    { value: '3', label: '3: 4/10 to 6/10' },
                    { value: '4', label: '4: 7/10 to 8/10' },
                    { value: '5', label: '5: 9/10' },
                    { value: '6', label: '6: 10/10 (Consolidated)' },
                    { value: '7', label: '7: Ice cover not continuous' },
                    { value: '8', label: '8: Ice cover continuous' },
                    { value: '9', label: '9: Obscured/Indiscernible' },
                    { value: '/', label: '/: Unable to report' }
                ]
            },
            { 
                id: 'ice_stage', 
                type: 'select', 
                label: 'Stage of Development (Si)', 
                width: 1,
                default: '/',
                options: [
                    { value: '0', label: '0: New ice only' },
                    { value: '1', label: '1: Nilas (< 10cm)' },
                    { value: '2', label: '2: Young ice (10-30cm)' },
                    { value: '3', label: '3: Grey ice (10-15cm)' },
                    { value: '4', label: '4: Grey-white ice (15-30cm)' },
                    { value: '5', label: '5: First-year ice (30-200cm)' },
                    { value: '6', label: '6: Old ice' },
                    { value: '7', label: '7: Land-fast ice' },
                    { value: '8', label: '8: Slate/Hummocked ice' },
                    { value: '9', label: '9: Icebergs' },
                    { value: '/', label: '/: Unable to report' }
                ]
            },
            { 
                id: 'ice_land', 
                type: 'select', 
                label: 'Ice of Land Origin (bi)', 
                width: 1,
                default: '/',
                options: [
                    { value: '0', label: '0: None' },
                    { value: '1', label: '1: 1-5 icebergs' },
                    { value: '2', label: '2: 6-10 icebergs' },
                    { value: '3', label: '3: 11-20 icebergs' },
                    { value: '4', label: '4: > 20 icebergs' },
                    { value: '5', label: '5: Growlers/Bergy bits' },
                    { value: '/', label: '/: Unable to report' }
                ]
            },
            { 
                id: 'ice_bearing', 
                type: 'select', 
                label: 'Bearing of Ice Edge (Di)', 
                width: 1,
                default: '/',
                options: [
                    { value: '0', label: '0: Ship in ice' },
                    { value: '1', label: '1: NE' },
                    { value: '2', label: '2: E' },
                    { value: '3', label: '3: SE' },
                    { value: '4', label: '4: S' },
                    { value: '5', label: '5: SW' },
                    { value: '6', label: '6: W' },
                    { value: '7', label: '7: NW' },
                    { value: '8', label: '8: N' },
                    { value: '9', label: '9: Parallel to course' },
                    { value: '/', label: '/: Unable to report' }
                ]
            },
            { 
                id: 'ice_trend', 
                type: 'select', 
                label: 'Present Ice Situation Trend (zi)', 
                width: 1,
                default: '/',
                options: [
                    { value: '0', label: '0: Improving' },
                    { value: '1', label: '1: Stationary' },
                    { value: '2', label: '2: Worsening' },
                    { value: '3', label: '3: Ice breaking up' },
                    { value: '4', label: '4: Ice opening' },
                    { value: '5', label: '5: Ice closing' },
                    { value: '6', label: '6: Ice freezing' },
                    { value: '7', label: '7: Ice drift increasing' },
                    { value: '8', label: '8: Ice drift decreasing' },
                    { value: '9', label: '9: Ice drift changing' },
                    { value: '/', label: '/: Unable to report' }
                ]
            }
        ]
    }
];

const CLOUD_DETAILS = {
    low: {
        title: "Low Clouds (CL)",
        types: {
            "1": { desc: "Cumulus with little vertical extent", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/cl1.jpg"] },
            "2": { desc: "Cumulus of moderate or strong vertical extent", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/cl2.jpg"] },
            "3": { desc: "Cumulonimbus without anvil; at least partially, the summits lack sharp outlines", credit: "photo KNMI", images: ["clouds/cl3.jpg"] },
            "4": { desc: "Stratocumulus formed by the spreading out of Cumulus", credit: "photo KNMI", images: ["clouds/cl4.jpg"] },
            "5": { desc: "Stratocumulus not resulting from the spreading out of Cumulus", credit: "photo KNMI", images: ["clouds/cl5.jpg"] },
            "6": { desc: "Stratus in a more or less continuous sheet or layer, or in ragged shreds, or both; no Stratus Fractus of Bad weather present", credit: "photo by Kruegler", images: ["clouds/cl6.jpg"] },
            "7": { desc: "Stratus Fractus of Bad weather and/or Cumulus fractus of bad weather; generally moving fast and changing shape rapidly; usually below Cm 2", credit: "photo by Kruegler", images: ["clouds/cl7.jpg"] },
            "8": { desc: "Cumulus and Stratocumulus not formed from the spreading out of Cumulus; bases at different levels", credit: "photo by T. Bergeron", images: ["clouds/cl8.jpg"] },
            "9": { desc: "Cumulonimbus; upper part is clearly fibrous (cirriform); often in the form of an anvil", credit: "photo by B. Muehr", images: ["clouds/cl9.jpg"] },
            "0": { desc: "No CL clouds", credit: "", images: [] },
            "/": { desc: "Not determined", credit: "", images: [] }
        }
    },
    mid: {
        title: "Middle Clouds (CM)",
        types: {
            "1": { desc: "Thin Altostratus; major part of the layer is sufficiently thin to reveal the position of the sun (no Halo)", credit: "photo by Kruegler", images: ["clouds/cm1.jpg"] },
            "2": { desc: "Thick Altostratus or Nimbostratus", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/cm2.jpg"] },
            "3": { desc: "Semi-transparent Altocumulus; the elements of the cloud change only slowly; at a single level", credit: "photo by B. Muehr", images: ["clouds/cm3.jpg"] },
            "4": { desc: "Patches (often in the form of almonds or fishes) of Altocumulus; elements are continually changing in appearance; at one or more levels", credit: "photo by Stahl", images: ["clouds/cm4.jpg"] },
            "5": { desc: "Altocumulus; progressively invading the sky; generally, thicken as a whole", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/cm5.jpg"] },
            "6": { desc: "Altocumulus formed from the spreading out of Cumulus (or Cumulonimbus)", credit: "photo by A. Viaut", images: ["clouds/cm6.jpg"] },
            "7": { desc: "Altocumulus in two or more layers, not increasing; OR Altocumulus opacus in a single layer, not increasing; OR Altocumulus with Altostratus/Nimbostratus", credit: "photo by R.K. Pilsbury / T. Bergeron / A.J. Aalders", images: ["clouds/cm7a.jpg", "clouds/cm7b.jpg", "clouds/cm7c.jpg"] },
            "8": { desc: "Altocumulus with tower like sproutings.", credit: "photo Australian Bureau of Meteorology", images: ["clouds/cm8.jpg"] },
            "9": { desc: "Altocumulus of a chaotic sky; generally at several levels; usually clouds of all Cm types mixed with Cl and Ch", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/cm9.jpg"] },
            "0": { desc: "No CM clouds", credit: "", images: [] },
            "/": { desc: "Not determined", credit: "", images: [] }
        }
    },
    high: {
        title: "High Clouds (CH)",
        types: {
            "1": { desc: "Cirrus filaments, strands, hooks, not expanding.", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/ch1.jpg"] },
            "2": { desc: "Dense cirrus in patches or sheaves, not increasing, or cirrus like cumuliform tufts.", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/ch2.jpg"] },
            "3": { desc: "Dense cirrus, often the anvil remaining from cumulonimbus. ", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/ch3.jpg"] },
            "4": { desc: "Cirrus in the form of hooks or of filaments, or both (no Cirrostratus present); progressively invading the sky; generally, become denser as a whole", credit: "photo by R.K. Pilsbury (Crown copyright)", images: ["clouds/ch4.jpg"] },
            "5": { desc: "Cirrus (often in bands) and Cirrostratus, or Cirrostratus alone; progressively invading the sky; generally growing denser as a whole; continuous veil does not reach 45 degrees above the horizon", credit: "photo KNMI", images: ["clouds/ch5.jpg"] },
            "6": { desc: "Cirrus (often in bands) and Cirrostratus, or Cirrostratus alone; progressively invading the sky; generally growing denser as a whole; continuous veil extends more than 45 degrees above the horizon; sky not being totally covered", credit: "photo KNMI", images: ["clouds/ch6.jpg"] },
            "7": { desc: "Cirrostratus covering the whole sky; it gives rise to Halo phenomena around the sun or moon", credit: "photo by B. Muehr", images: ["clouds/ch7.jpg"] },
            "8": { desc: "Cirrostratus; not progressively invading the sky; not covering the whole sky", credit: "photo Australian Bureau of Meteorology", images: ["clouds/ch8.jpg"] },
            "9": { desc: "Amount of Cirrocumulus is greater than any other types of Cirrus / Cirrostratus which may be present", credit: "photo Australian Bureau of Meteorology", images: ["clouds/ch9.jpg"] },
            "0": { desc: "No CH clouds", credit: "", images: [] },
            "/": { desc: "Not determined", credit: "", images: [] }
        }
    }
};

const PRESENT_WEATHER_CATEGORIES = [
    {
        label: "//: Not observed or not determined",
        range: null,
        options: [
            { value: '//', label: '//: Not observed or not determined' }
        ]
    },
    {
        label: "95-99 Thunderstorm at time of observation",
        range: [95, 99],
        options: [
            { value: '99', label: '99: Heavy thunderstorm with hail' },
            { value: '98', label: '98: Thunderstorm with duststorm or sandstorm' },
            { value: '97', label: '97: Heavy thunderstorm with rain/snow, no hail' },
            { value: '96', label: '96: Slight/moderate thunderstorm with hail' },
            { value: '95', label: '95: Slight/moderate thunderstorm with rain/snow, no hail' }
        ]
    },
    {
        label: "91-94 Thunderstorm during the past hour, but not now",
        range: [91, 94],
        options: [
            { value: '94', label: '94: Mod/heavy snow/rain/hail & Thunderstorm in past hour' },
            { value: '93', label: '93: Slight snow/rain/hail & Thunderstorm in past hour' },
            { value: '92', label: '92: Moderate or heavy rain & Thunderstorm in past hour' },
            { value: '91', label: '91: Slight rain & Thunderstorm in past hour' }
        ]
    },
    {
        label: "85-90 Solid precipitation in showers",
        range: [85, 90],
        options: [
            { value: '90', label: '90: Shower of hail, moderate or heavy' },
            { value: '89', label: '89: Shower of hail, slight' },
            { value: '88', label: '88: Shower of snow/ice pellets, moderate or heavy' },
            { value: '87', label: '87: Shower of snow/ice pellets, slight' },
            { value: '86', label: '86: Shower of snow, moderate or heavy' },
            { value: '85', label: '85: Shower of snow, slight' }
        ]
    },
    {
        label: "80-84 Rain showers",
        range: [80, 84],
        options: [
            { value: '84', label: '84: Shower of rain and snow mixed, moderate or heavy' },
            { value: '83', label: '83: Shower of rain and snow mixed, slight' },
            { value: '82', label: '82: Violent rain shower' },
            { value: '81', label: '81: Moderate or heavy rain shower' },
            { value: '80', label: '80: Slight rain shower' }
        ]
    },
    {
        label: "70-79 Solid precipitation not falling as showers",
        range: [70, 79],
        options: [
            { value: '79', label: '79: Ice pellets' },
            { value: '78', label: '78: Isolated star-like snow crystals' },
            { value: '77', label: '77: Snow grains' },
            { value: '76', label: '76: Diamond dust' },
            { value: '75', label: '75: Heavy snow in flakes (Continuous)' },
            { value: '74', label: '74: Heavy snow in flakes (Intermittent)' },
            { value: '73', label: '73: Moderate snow in flakes (Continuous)' },
            { value: '72', label: '72: Moderate snow in flakes (Intermittent)' },
            { value: '71', label: '71: Slight snow in flakes (Continuous)' },
            { value: '70', label: '70: Slight snow in flakes (Intermittent)' }
        ]
    },
    {
        label: "60-69 Rain (not falling as showers)",
        range: [60, 69],
        options: [
            { value: '69', label: '69: Rain/drizzle with snow, moderate or heavy' },
            { value: '68', label: '68: Rain/drizzle with snow, slight' },
            { value: '67', label: '67: Freezing rain, moderate or heavy' },
            { value: '66', label: '66: Freezing rain, slight' },
            { value: '65', label: '65: Heavy rain (Continuous)' },
            { value: '64', label: '64: Heavy rain (Intermittent)' },
            { value: '63', label: '63: Moderate rain (Continuous)' },
            { value: '62', label: '62: Moderate rain (Intermittent)' },
            { value: '61', label: '61: Slight rain (Continuous)' },
            { value: '60', label: '60: Slight rain (Intermittent)' }
        ]
    },
    {
        label: "50-59 Drizzle",
        range: [50, 59],
        options: [
            { value: '59', label: '59: Drizzle and rain mixed, moderate or heavy' },
            { value: '58', label: '58: Drizzle and rain mixed, slight' },
            { value: '57', label: '57: Freezing drizzle, moderate or heavy' },
            { value: '56', label: '56: Freezing drizzle, slight' },
            { value: '55', label: '55: Heavy drizzle (Continuous)' },
            { value: '54', label: '54: Heavy drizzle (Intermittent)' },
            { value: '53', label: '53: Moderate drizzle (Continuous)' },
            { value: '52', label: '52: Moderate drizzle (Intermittent)' },
            { value: '51', label: '51: Slight drizzle (Continuous)' },
            { value: '50', label: '50: Slight drizzle (Intermittent)' }
        ]
    },
    {
        label: "40-49 Fog at the time of observation",
        range: [40, 49],
        options: [
            { value: '49', label: '49: Fog, depositing rime (Sky invisible)' },
            { value: '48', label: '48: Fog, depositing rime (Sky visible)' },
            { value: '47', label: '47: Fog, begun/thickened in past hour (Sky invisible)' },
            { value: '46', label: '46: Fog, begun/thickened in past hour (Sky visible)' },
            { value: '45', label: '45: Fog, no change in past hour (Sky invisible)' },
            { value: '44', label: '44: Fog, no change in past hour (Sky visible)' },
            { value: '43', label: '43: Fog, thinner in past hour (Sky invisible)' },
            { value: '42', label: '42: Fog, thinner in past hour (Sky visible)' },
            { value: '41', label: '41: Fog in patches' },
            { value: '40', label: '40: Fog at a distance' }
        ]
    },
    {
        label: "30-39 Dust/Sand/Snow storms",
        range: [30, 39],
        options: [
            { value: '39', label: '39: Heavy blowing snow (high)' },
            { value: '38', label: '38: Slight/moderate blowing snow (high)' },
            { value: '37', label: '37: Heavy drifting snow (low)' },
            { value: '36', label: '36: Slight/moderate drifting snow (low)' },
            { value: '35', label: '35: Heavy dust/sandstorm (increasing)' },
            { value: '34', label: '34: Heavy dust/sandstorm (unchanging)' },
            { value: '33', label: '33: Heavy dust/sandstorm (decreasing)' },
            { value: '32', label: '32: Slight/moderate dust/sandstorm (increasing)' },
            { value: '31', label: '31: Slight/moderate dust/sandstorm (unchanging)' },
            { value: '30', label: '30: Slight/moderate dust/sandstorm (decreasing)' }
        ]
    },
    {
        label: "20-29 Phenomena in past hour but not now",
        range: [20, 29],
        options: [
            { value: '29', label: '29: Thunderstorm (with/without precip)' },
            { value: '28', label: '28: Fog' },
            { value: '27', label: '27: Shower(s) of hail/rain mixed' },
            { value: '26', label: '26: Shower(s) of snow/rain mixed' },
            { value: '25', label: '25: Shower(s) of rain' },
            { value: '24', label: '24: Freezing drizzle or freezing rain' },
            { value: '23', label: '23: Rain and snow mixed, or ice pellets' },
            { value: '22', label: '22: Snow' },
            { value: '21', label: '21: Rain (not freezing)' },
            { value: '20', label: '20: Drizzle (not freezing) or snow grains' }
        ]
    },
    {
        label: "17-19 Squalls, Funnel clouds, Thunder",
        range: [17, 19],
        options: [
            { value: '19', label: '19: Funnel cloud(s)' },
            { value: '18', label: '18: Squalls' },
            { value: '17', label: '17: Thunder (no precip)' }
        ]
    },
    {
        label: "13-16 Phenomena within sight but not at ship",
        range: [13, 16],
        options: [
            { value: '16', label: '16: Precip within 3nm (reaching surface)' },
            { value: '15', label: '15: Precip beyond 3nm (reaching surface)' },
            { value: '14', label: '14: Precip in sight (not reaching surface)' },
            { value: '13', label: '13: Lightning visible, no thunder' }
        ]
    },
    {
        label: "10-12 Mist and shallow fog",
        range: [10, 12],
        options: [
            { value: '12', label: '12: Shallow fog (continuous)' },
            { value: '11', label: '11: Shallow fog (patches)' },
            { value: '10', label: '10: Mist' }
        ]
    },
    {
        label: "04-09 Haze, dust, sand or smoke",
        range: [4, 9],
        options: [
            { value: '09', label: '09: Duststorm or sandstorm within sight' },
            { value: '08', label: '08: Dust whirls (NOT FOR MARINE USE)' },
            { value: '07', label: '07: Blowing spray' },
            { value: '06', label: '06: Widespread dust suspended in air' },
            { value: '05', label: '05: Dry haze' },
            { value: '04', label: '04: Visibility reduced by smoke' }
        ]
    },
    {
        label: "00-03 Change of sky during past hour",
        range: [0, 3],
        options: [
            { value: '03', label: '03: Clouds generally forming/developing' },
            { value: '02', label: '02: State of sky unchanged' },
            { value: '01', label: '01: Clouds dissolving' },
            { value: '00', label: '00: Cloud development not observable' }
        ]
    }
];
