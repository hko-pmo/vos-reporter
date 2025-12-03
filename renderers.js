const Renderers = {
    renderPositionComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100px') => {
            const wrapper = document.createElement('div');
            wrapper.style.marginRight = '1rem';
            
            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.style.display = 'block';
            lbl.style.fontSize = '0.8rem';
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = type;
            inp.style.width = width;
            inp.value = formData[id] || '';
            inp.addEventListener('input', (e) => {
                store.updateFormData(id, e.target.value);
                updatePositionValues();
            });
            wrapper.appendChild(inp);
            return wrapper;
        };

        const createRadio = (id, name, options, isHorizontal = false) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = isHorizontal ? 'row' : 'column';
            wrapper.style.justifyContent = 'center';
            if (isHorizontal) wrapper.style.alignItems = 'center';
            
            options.forEach(opt => {
                const row = document.createElement('div');
                if (isHorizontal) {
                    row.style.marginRight = '1rem';
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                } else {
                    row.style.marginBottom = '0.2rem';
                }
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = name;
                radio.value = opt.value;
                radio.checked = formData[id] === opt.value;
                radio.addEventListener('change', (e) => {
                    store.updateFormData(id, e.target.value);
                    updatePositionValues();
                });

                const lbl = document.createElement('label');
                lbl.textContent = opt.label;
                lbl.style.marginLeft = '0.3rem';
                lbl.style.fontWeight = 'normal';
                
                row.appendChild(radio);
                row.appendChild(lbl);
                wrapper.appendChild(row);
            });
            return wrapper;
        };

        // Latitude Row
        const latRow = document.createElement('div');
        latRow.className = 'input-group';
        latRow.innerHTML = '<label>Latitude</label>';
        const latFlex = document.createElement('div');
        latFlex.style.display = 'flex';
        latFlex.style.alignItems = 'center';
        
        const latDeg = createInput('pos_lat_deg', 'Degrees');
        latDeg.querySelector('input').min = 0;
        latDeg.querySelector('input').max = 90;
        latFlex.appendChild(latDeg);

        const latMin = createInput('pos_lat_min', 'Minutes');
        latMin.querySelector('input').min = 0;
        latMin.querySelector('input').max = 59.9;
        latMin.querySelector('input').step = 0.1;
        latFlex.appendChild(latMin);

        latFlex.appendChild(createRadio('pos_lat_dir', 'lat_dir', [
            { value: 'N', label: 'North' },
            { value: 'S', label: 'South' }
        ]));
        latRow.appendChild(latFlex);
        container.appendChild(latRow);

        // Longitude Row
        const longRow = document.createElement('div');
        longRow.className = 'input-group';
        longRow.innerHTML = '<label>Longitude</label>';
        const longFlex = document.createElement('div');
        longFlex.style.display = 'flex';
        longFlex.style.alignItems = 'center';

        const longDeg = createInput('pos_long_deg', 'Degrees');
        longDeg.querySelector('input').min = 0;
        longDeg.querySelector('input').max = 180;
        longFlex.appendChild(longDeg);

        const longMin = createInput('pos_long_min', 'Minutes');
        longMin.querySelector('input').min = 0;
        longMin.querySelector('input').max = 59.9;
        longMin.querySelector('input').step = 0.1;
        longFlex.appendChild(longMin);

        // Vertical layout for Longitude (same as Latitude)
        longFlex.appendChild(createRadio('pos_long_dir', 'long_dir', [
            { value: 'W', label: 'West' },
            { value: 'E', label: 'East' }
        ]));
        longRow.appendChild(longFlex);
        container.appendChild(longRow);

        // Add validation logic to inputs
        [latDeg, latMin, longDeg, longMin].forEach(wrapper => {
            const inp = wrapper.querySelector('input');
            inp.addEventListener('input', () => {
                const val = parseFloat(inp.value);
                if (!isNaN(val)) {
                    if (inp.min && val < parseFloat(inp.min)) inp.setCustomValidity(`Min ${inp.min}`);
                    else if (inp.max && val > parseFloat(inp.max)) inp.setCustomValidity(`Max ${inp.max}`);
                    else inp.setCustomValidity('');
                } else {
                    inp.setCustomValidity('');
                }
                inp.reportValidity();
            });
        });

        // --- Ship Course & Speed ---
        const marineHeader = document.createElement('h3');
        marineHeader.textContent = 'Ship Course & Speed';
        marineHeader.style.marginTop = '1.5rem';
        marineHeader.style.marginBottom = '0.5rem';
        marineHeader.style.fontSize = '1rem';
        marineHeader.style.borderBottom = '1px solid #eee';
        container.appendChild(marineHeader);

        const createSelect = (id, label, options) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            const lbl = document.createElement('label');
            lbl.textContent = label;
            wrapper.appendChild(lbl);
            
            const sel = document.createElement('select');
            sel.id = id;
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                sel.appendChild(o);
            });
            sel.value = formData[id] || '/';
            sel.addEventListener('change', (e) => {
                store.updateFormData(id, e.target.value);
                updatePreview(group);
            });
            wrapper.appendChild(sel);
            return wrapper;
        };

        const courseSelect = createSelect('course', 'Ship Course (Ds)', [
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
        ]);
        container.appendChild(courseSelect);

        const speedSelect = createSelect('speed', 'Ship Speed (Vs)', [
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
        ]);
        container.appendChild(speedSelect);

        function updatePositionValues() {
            const fd = store.getFormData();
            const latDeg = parseFloat(fd['pos_lat_deg']);
            const latMin = parseFloat(fd['pos_lat_min']);
            const latDir = fd['pos_lat_dir'];
            
            const longDeg = parseFloat(fd['pos_long_deg']);
            const longMin = parseFloat(fd['pos_long_min']);
            const longDir = fd['pos_long_dir'];

            if (!isNaN(latDeg) && !isNaN(latMin) && latDir) {
                const latDecimal = latDeg + (latMin / 60);
                const latTenths = Math.round(latDecimal * 10);
                store.updateFormData('lat_final', latTenths.toString());
            } else {
                store.updateFormData('lat_final', '');
            }

            if (!isNaN(longDeg) && !isNaN(longMin) && longDir) {
                const longDecimal = longDeg + (longMin / 60);
                const longTenths = Math.round(longDecimal * 10);
                store.updateFormData('long_final', longTenths.toString());
            } else {
                store.updateFormData('long_final', '');
            }

            if (latDir && longDir) {
                let qc = '';
                if (latDir === 'N' && longDir === 'E') qc = '1';
                if (latDir === 'S' && longDir === 'E') qc = '3';
                if (latDir === 'S' && longDir === 'W') qc = '5';
                if (latDir === 'N' && longDir === 'W') qc = '7';
                store.updateFormData('quadrant_final', qc);
            } else {
                store.updateFormData('quadrant_final', '');
            }

            updatePreview(group);
        }
    },

    renderWindComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        // Helper for standard inputs
        const createInput = (field) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            const lbl = document.createElement('label');
            lbl.textContent = field.label;
            wrapper.appendChild(lbl);
            
            const inp = document.createElement('input');
            inp.type = field.type === 'number' ? 'number' : 'text';
            inp.id = field.id;
            inp.value = formData[field.id] || '';
            if (field.min !== undefined) inp.min = field.min;
            if (field.max !== undefined) inp.max = field.max;
            
            inp.addEventListener('input', (e) => {
                store.updateFormData(field.id, e.target.value);
                updatePreview(group);
            });
            wrapper.appendChild(inp);
            return wrapper;
        };

        // Cloud Cover (Hidden/Computed usually, but here it's text)
        // Actually in data.js it is hidden: true, default: '/'. So we skip rendering it if hidden.
        
        // Wind Direction (Smart Input)
        const dirWrapper = document.createElement('div');
        dirWrapper.className = 'input-group';
        const dirLabel = document.createElement('label');
        dirLabel.textContent = 'True Wind Direction (dd)';
        dirWrapper.appendChild(dirLabel);

        const dirInput = document.createElement('input');
        dirInput.type = 'text'; // Allow text for "Calm", "Var"
        dirInput.placeholder = 'Degrees (0-360) or 0=Calm, 99=Var';
        
        // Initial Value Logic
        const currentDir = formData['wind_dir'];
        if (currentDir === '0' || currentDir === '00') dirInput.value = 'Calm (0)';
        else if (currentDir === '99') dirInput.value = 'Variable (99)';
        else if (currentDir) {
            // Convert tens back to degrees for display (approx)
            dirInput.value = `${parseInt(currentDir) * 10}`; 
        }

        dirInput.addEventListener('change', (e) => {
            let val = e.target.value.trim().toLowerCase();
            let code = '';
            let display = '';

            if (val === 'calm' || val === '0' || val === '00') {
                code = '00';
                display = 'Calm (0)';
            } else if (val === 'var' || val === 'variable' || val === '99') {
                code = '99';
                display = 'Variable (99)';
            } else {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                    if (num >= 0 && num <= 360) {
                        let tens = Math.round(num / 10);
                        if (tens === 0) {
                            // 0-4 degrees -> Calm? Or 360?
                            // Usually 360 -> 36. 0 -> Calm.
                            // If user typed 0, handled above.
                            // If user typed 4 -> 0 -> Calm.
                            // If user typed 358 -> 36.
                            if (num < 5 && num > 0) {
                                // Ambiguous. Let's assume 360 if they meant North, but 0 is Calm.
                                // Standard: 0 is calm. 360 is North (36).
                                // If input is small number, maybe they meant tens?
                                // We assume DEGREES.
                                code = '00'; 
                                display = 'Calm (0)';
                            } else {
                                code = tens.toString().padStart(2, '0');
                                display = `${num}° (Code: ${code})`;
                            }
                        } else {
                            code = tens.toString().padStart(2, '0');
                            display = `${num}° (Code: ${code})`;
                        }
                    } else {
                        // Invalid
                        alert('Direction must be 0-360');
                        e.target.value = '';
                        return;
                    }
                } else {
                    // Invalid text
                    return;
                }
            }
            
            store.updateFormData('wind_dir', code);
            e.target.value = display;
            updatePreview(group);
        });

        // On focus, clear the "fancy" text to allow editing
        dirInput.addEventListener('focus', (e) => {
            const val = store.getFormData()['wind_dir'];
            if (val === '00') e.target.value = '0';
            else if (val === '99') e.target.value = '99';
            else if (val) e.target.value = parseInt(val) * 10;
            else e.target.value = '';
        });

        dirWrapper.appendChild(dirInput);
        const dirHelp = document.createElement('div');
        dirHelp.className = 'help-text';
        dirHelp.textContent = 'Input degrees (0-360). 0=Calm, 99=Variable. Auto-converts to tens.';
        dirWrapper.appendChild(dirHelp);
        container.appendChild(dirWrapper);

        // Wind Speed
        const speedField = group.fields.find(f => f.id === 'wind_speed');
        container.appendChild(createInput(speedField));
    },

    renderTempHumidityComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '', min = undefined, max = undefined) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            
            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.htmlFor = id;
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = type;
            inp.id = id;
            inp.style.width = width;
            inp.value = formData[id] || '';
            inp.step = '0.1';
            if (min !== undefined) inp.min = min;
            if (max !== undefined) inp.max = max;

            inp.addEventListener('input', (e) => {
                const val = e.target.value;
                if (type === 'number' && val !== '') {
                    const numVal = parseFloat(val);
                    if (min !== undefined && numVal < min) {
                        inp.setCustomValidity(`Value must be >= ${min}`);
                    } else if (max !== undefined && numVal > max) {
                        inp.setCustomValidity(`Value must be <= ${max}`);
                    } else {
                        inp.setCustomValidity('');
                    }
                    inp.reportValidity();
                }
                store.updateFormData(id, val);
                updateTempValues();
            });
            wrapper.appendChild(inp);

            if (help) {
                const h = document.createElement('div');
                h.className = 'help-text';
                h.textContent = help;
                wrapper.appendChild(h);
            }
            return { wrapper, inp };
        };

        const airTemp = createInput('th_air_val', 'Air Temperature (Dry-bulb) [-50.0 - 60.0°C]', 'number', '100%', 'e.g. 24.5', -50.0, 60.0);
        container.appendChild(airTemp.wrapper);

        const modeWrapper = document.createElement('div');
        modeWrapper.className = 'input-group';
        const modeLabel = document.createElement('label');
        modeLabel.textContent = 'Humidity Measurement';
        modeWrapper.appendChild(modeLabel);

        const modeSelect = document.createElement('select');
        modeSelect.id = 'th_mode';
        const modes = [
            { value: 'none', label: 'Not Determined' },
            { value: 'wetbulb', label: 'Wet-bulb Temperature [°C]' },
            { value: 'rh', label: 'Relative Humidity [%]' }
        ];
        modes.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.value;
            opt.textContent = m.label;
            modeSelect.appendChild(opt);
        });
        modeSelect.value = formData['th_mode'] || 'none';
        modeSelect.addEventListener('change', (e) => {
            store.updateFormData('th_mode', e.target.value);
            localStorage.setItem('vos_th_mode', e.target.value);
            updateVisibility();
            updateTempValues();
        });
        modeWrapper.appendChild(modeSelect);
        container.appendChild(modeWrapper);

        const humVal = createInput('th_hum_val', 'Value', 'number');
        humVal.wrapper.style.display = 'none';
        container.appendChild(humVal.wrapper);

        const debugBox = document.createElement('div');
        debugBox.style.marginTop = '1rem';
        debugBox.style.padding = '0.5rem';
        debugBox.style.backgroundColor = '#f0f0f0';
        debugBox.style.border = '1px solid #ccc';
        debugBox.style.borderRadius = '4px';
        debugBox.style.fontSize = '0.9rem';
        debugBox.style.color = '#333';
        debugBox.textContent = 'Calculated Dew Point: --';
        container.appendChild(debugBox);

        function updateVisibility() {
            const fd = store.getFormData();
            const mode = fd['th_mode'] || 'none';
            if (mode === 'none') {
                humVal.wrapper.style.display = 'none';
            } else {
                humVal.wrapper.style.display = 'block';
                const label = humVal.wrapper.querySelector('label');
                if (mode === 'wetbulb') {
                    label.textContent = 'Wet-bulb Temperature [-50.0 - 50.0°C]';
                    humVal.inp.min = '-50.0';
                    humVal.inp.max = '50.0';
                } else {
                    label.textContent = 'Relative Humidity [0.0 - 100.0 %]';
                    humVal.inp.min = '0';
                    humVal.inp.max = '100';
                }
            }
        }

        function calculateDewPoint(T, mode, val) {
            if (mode === 'wetbulb') {
                const Tw = val;
                const P_hPa = 1013.25;
                const a = 0.00066;
                const es_magnus = (Tc) => 6.112 * Math.exp((17.62 * Tc) / (243.12 + Tc));
                const es_Tw = es_magnus(Tw);
                const e = es_Tw - a * P_hPa * (T - Tw);
                if (e <= 0) return NaN;
                const ln_ratio = Math.log(e / 6.112);
                return (243.12 * ln_ratio) / (17.62 - ln_ratio);
            } else if (mode === 'rh') {
                const RH = val;
                if (RH <= 0) return NaN;
                const a = 17.62;
                const b = 243.12;
                const es = 6.112 * Math.exp((a * T) / (b + T));
                const e = (RH / 100.0) * es;
                if (e <= 0) return NaN;
                const ln_ratio = Math.log(e / 6.112);
                return (b * ln_ratio) / (a - ln_ratio);
            }
            return NaN;
        }

        function updateTempValues() {
            const fd = store.getFormData();
            const airVal = parseFloat(fd['th_air_val']);
            const mode = fd['th_mode'] || 'none';
            const humValNum = parseFloat(fd['th_hum_val']);

            let code = '';
            let dewPoint = NaN;

            if (!isNaN(airVal)) {
                const sign = airVal >= 0 ? '0' : '1';
                const temp = Math.round(Math.abs(airVal) * 10).toString().padStart(3, '0');
                code += `1${sign}${temp}`;

                if (mode !== 'none' && !isNaN(humValNum)) {
                    dewPoint = calculateDewPoint(airVal, mode, humValNum);
                    if (!isNaN(dewPoint)) {
                        const dpSign = dewPoint >= 0 ? '0' : '1';
                        const dpTemp = Math.round(Math.abs(dewPoint) * 10).toString().padStart(3, '0');
                        code += ` 2${dpSign}${dpTemp}`;
                    }
                    if (mode === 'wetbulb') {
                        const sw = '0';
                        const tbVal = Math.round(Math.abs(humValNum) * 10).toString().padStart(3, '0');
                        code += ` 8${sw}${tbVal}`;
                    }
                }
            }

            if (!isNaN(dewPoint)) {
                debugBox.textContent = `Calculated Dew Point: ${dewPoint.toFixed(1)} °C`;
            } else {
                debugBox.textContent = 'Calculated Dew Point: --';
            }

            store.updateFormData('temp_humidity_code', code);
            updatePreview(group);
        }

        updateVisibility();
        updateTempValues();
    },

    renderPresentWeatherComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        // Helper to create standard select
        const createSelect = (field) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            const lbl = document.createElement('label');
            lbl.textContent = field.label;
            wrapper.appendChild(lbl);
            
            const sel = document.createElement('select');
            sel.id = field.id;
            field.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                sel.appendChild(o);
            });
            sel.value = formData[field.id] || field.default || '';
            sel.addEventListener('change', (e) => {
                store.updateFormData(field.id, e.target.value);
                updatePreview(group);
            });
            wrapper.appendChild(sel);
            if (field.help) {
                const h = document.createElement('div');
                h.className = 'help-text';
                h.textContent = field.help;
                wrapper.appendChild(h);
            }
            return wrapper;
        };

        // Present Weather Logic
        const pwWrapper = document.createElement('div');
        pwWrapper.className = 'input-group';
        
        const pwLabel = document.createElement('label');
        pwLabel.textContent = 'Present Weather (ww)';
        pwWrapper.appendChild(pwLabel);

        // Category Select
        const catSelect = document.createElement('select');
        catSelect.style.marginBottom = '0.5rem';
        // Add invalid styling support
        catSelect.addEventListener('change', () => {
            if (catSelect.value === '') catSelect.setCustomValidity('Required');
            else catSelect.setCustomValidity('');
        });

        PRESENT_WEATHER_CATEGORIES.forEach((cat, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = cat.label;
            catSelect.appendChild(opt);
        });
        
        // Code Select
        const codeSelect = document.createElement('select');
        
        // Logic to populate code select
        const updateCodeOptions = () => {
            const catIdx = catSelect.value;
            const cat = PRESENT_WEATHER_CATEGORIES[catIdx];
            codeSelect.innerHTML = '';
            
            // If category is the default "//", we handle it specifically
            if (cat.options.length === 1 && cat.options[0].value === '//') {
                 const o = document.createElement('option');
                 o.value = '//';
                 o.textContent = '//: Not observed or not determined';
                 codeSelect.appendChild(o);
                 codeSelect.disabled = true;
                 codeSelect.style.backgroundColor = '#e9ecef'; // Grey out
                 store.updateFormData('present_weather', '//');
            } else {
                 cat.options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.value;
                    o.textContent = opt.label;
                    codeSelect.appendChild(o);
                 });
                 codeSelect.disabled = false;
                 codeSelect.style.backgroundColor = '';
                 
                 // If current formData value is in this category, keep it. Else select first.
                 const currentVal = formData['present_weather'];
                 const exists = cat.options.find(o => o.value === currentVal);
                 if (exists) {
                     codeSelect.value = currentVal;
                 } else {
                     codeSelect.value = cat.options[0].value;
                     store.updateFormData('present_weather', cat.options[0].value);
                 }
            }
        };

        // Initialize Category based on current formData['present_weather']
        const currentPw = formData['present_weather'] || '//';
        let foundCatIndex = 0;
        PRESENT_WEATHER_CATEGORIES.forEach((cat, idx) => {
            if (cat.options.find(o => o.value === currentPw)) {
                foundCatIndex = idx;
            }
        });
        catSelect.value = foundCatIndex;
        
        catSelect.addEventListener('change', () => {
            updateCodeOptions();
            updatePreview(group);
        });

        codeSelect.addEventListener('change', (e) => {
            store.updateFormData('present_weather', e.target.value);
            updatePreview(group);
        });

        pwWrapper.appendChild(catSelect);
        pwWrapper.appendChild(codeSelect);
        
        // Initial population
        updateCodeOptions();
        // Ensure correct value is selected after population if it wasn't set by updateCodeOptions
        if (!codeSelect.disabled) {
             const currentVal = formData['present_weather'];
             // Verify again if it exists in current options (it should)
             if ([...codeSelect.options].some(o => o.value === currentVal)) {
                 codeSelect.value = currentVal;
             }
        }

        if (group.fields.find(f => f.id === 'present_weather').help) {
             const h = document.createElement('div');
             h.className = 'help-text';
             h.textContent = group.fields.find(f => f.id === 'present_weather').help;
             pwWrapper.appendChild(h);
        }

        container.appendChild(pwWrapper);

        // Render Past Weather 1 & 2
        const w1Field = group.fields.find(f => f.id === 'past_weather_1');
        const w2Field = group.fields.find(f => f.id === 'past_weather_2');
        
        container.appendChild(createSelect(w1Field));
        container.appendChild(createSelect(w2Field));
    },

    renderPressureTendencyComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '', min = undefined, max = undefined, step = '0.1') => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            
            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.htmlFor = id;
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = type;
            inp.id = id;
            inp.style.width = width;
            inp.value = formData[id] || '';
            inp.step = step;
            if (min !== undefined) inp.min = min;
            if (max !== undefined) inp.max = max;

            inp.addEventListener('input', (e) => {
                const val = e.target.value;
                if (type === 'number' && val !== '') {
                    const numVal = parseFloat(val);
                    if (min !== undefined && numVal < min) {
                        inp.setCustomValidity(`Value must be >= ${min}`);
                    } else if (max !== undefined && numVal > max) {
                        inp.setCustomValidity(`Value must be <= ${max}`);
                    } else {
                        inp.setCustomValidity('');
                    }
                    inp.reportValidity();
                }
                store.updateFormData(id, val);
                updateValues();
            });
            wrapper.appendChild(inp);

            if (help) {
                const h = document.createElement('div');
                h.className = 'help-text';
                h.textContent = help;
                wrapper.appendChild(h);
            }
            return { wrapper, inp };
        };

        // 1. Barometer Reading
        const pressInput = createInput('pt_pressure', 'Barometer reading [860.0 - 1070.0 hPa]', 'number', '100%', 'e.g. 1014.2. Leave empty if not measured.', 860.0, 1070.0);
        container.appendChild(pressInput.wrapper);

        // 2. Barometer Correction
        const corrInput = createInput('pt_correction', 'Barometer (instrument) correction [-8.0 to +8.0 hPa]', 'number', '100%', 'Correction to remove systematic bias.', -8.0, 8.0);
        corrInput.inp.addEventListener('change', (e) => {
            localStorage.setItem('vos_pt_correction', e.target.value);
        });
        container.appendChild(corrInput.wrapper);

        // 3. Height of Barometer
        const heightInput = createInput('pt_height', 'Height of Barometer [0 - 60 m]', 'number', '100%', 'Height above sea level. 0 means your reading is already corrected to MSL.', 0, 60, '0.1');
        // Default to 0 if empty? The user said "0 (as the default) means...". 
        // But if it's empty in formData, we might want to show 0 or treat as 0.
        // Let's set default value in UI if empty.
        if (!formData['pt_height']) {
            heightInput.inp.value = '0';
            store.updateFormData('pt_height', '0');
        }
        container.appendChild(heightInput.wrapper);

        // Debug Box for Corrected Pressure
        const debugBox = document.createElement('div');
        debugBox.style.marginTop = '1rem';
        debugBox.style.marginBottom = '1rem';
        debugBox.style.padding = '0.5rem';
        debugBox.style.backgroundColor = '#e6f7ff'; // Light blue
        debugBox.style.border = '1px solid #91d5ff';
        debugBox.style.borderRadius = '4px';
        debugBox.style.fontSize = '0.9rem';
        debugBox.style.color = '#0050b3';
        debugBox.textContent = 'Final corrected MSL pressure: -- hPa';
        container.appendChild(debugBox);

        // 4. Tendency Characteristic
        const charWrapper = document.createElement('div');
        charWrapper.className = 'input-group';
        const charLabel = document.createElement('label');
        charLabel.textContent = 'Pressure Tendency Characteristic';
        charWrapper.appendChild(charLabel);

        const charSelect = document.createElement('select');
        charSelect.id = 'pt_char';
        const charOptions = [
            { value: 'not_measured', label: 'Not measured' },
            { value: '0', label: '0: Increasing, then decreasing' },
            { value: '1', label: '1: Increasing, then steady' },
            { value: '2', label: '2: Increasing steadily or unsteadily' },
            { value: '3', label: '3: Decreasing or steady, then increasing' },
            { value: '4', label: '4: Steady' },
            { value: '5', label: '5: Decreasing, then increasing' },
            { value: '6', label: '6: Decreasing, then steady' },
            { value: '7', label: '7: Decreasing steadily or unsteadily' },
            { value: '8', label: '8: Increasing or steady, then decreasing' }
        ];
        charOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            charSelect.appendChild(option);
        });
        charSelect.value = formData['pt_char'] || 'not_measured';
        charSelect.addEventListener('change', (e) => {
            store.updateFormData('pt_char', e.target.value);
            updateVisibility();
            updateValues();
        });
        charWrapper.appendChild(charSelect);
        container.appendChild(charWrapper);

        // 5. Amount of Change
        const amountInput = createInput('pt_amount', 'Amount of Change [0.0 - 50.0 hPa]', 'number', '100%', 'Change of pressure in last 3 hours, e.g. 1.4. No negative numbers. Use "Characteristic" to indicate minus sign.', 0.0, 50.0);
        container.appendChild(amountInput.wrapper);

        function updateVisibility() {
            const fd = store.getFormData();
            const charVal = fd['pt_char'] || 'not_measured';
            if (charVal === 'not_measured') {
                amountInput.inp.disabled = true;
                amountInput.inp.value = '';
                store.updateFormData('pt_amount', '');
            } else {
                amountInput.inp.disabled = false;
            }
        }

        function calculateMSLP(P_hpa, h_m, T_c) {
            // Constants
            const G = 9.80665;       // m/s^2
            const R_D = 287.05;      // J/(kg K)
            const T0_K = 273.15;
            const STANDARD_LAPSE = 0.0065;  // K/m

            // convert station temperature to Kelvin
            const T_k = T_c + T0_K;

            // approximate mean layer temperature (K) using standard lapse rate
            const T_mean_k = T_k + 0.5 * STANDARD_LAPSE * h_m;

            // exponent in hypsometric equation
            const exponent = (G * h_m) / (R_D * T_mean_k);

            // reduced pressure
            const msl_pressure_hpa = P_hpa * Math.exp(exponent);

            return msl_pressure_hpa;
        }

        function updateValues() {
            const fd = store.getFormData();
            const pressVal = parseFloat(fd['pt_pressure']);
            const corrVal = parseFloat(fd['pt_correction']);
            const heightVal = parseFloat(fd['pt_height']);
            const airTempVal = parseFloat(fd['th_air_val']); // From previous section

            const charVal = fd['pt_char'] || 'not_measured';
            const amountVal = parseFloat(fd['pt_amount']);

            let code = '';
            let finalPressure = NaN;

            if (!isNaN(pressVal)) {
                // 1. Apply Instrument Correction
                let pStation = pressVal;
                if (!isNaN(corrVal)) {
                    pStation += corrVal;
                }

                // 2. Apply Height Correction (Reduction to MSL)
                let h = 0;
                if (!isNaN(heightVal)) {
                    h = heightVal;
                }

                if (h > 0) {
                    // Need Air Temp. Default to 20 if missing.
                    let t = 20.0;
                    if (!isNaN(airTempVal)) {
                        t = airTempVal;
                    }
                    finalPressure = calculateMSLP(pStation, h, t);
                } else {
                    finalPressure = pStation;
                }

                // Update Debug Box
                debugBox.textContent = `Final corrected MSL pressure: ${finalPressure.toFixed(1)} hPa`;

                // Generate Code 4PPPP
                const pVal = Math.round(finalPressure * 10) % 10000;
                code += `4${pVal.toString().padStart(4, '0')}`;
            } else {
                debugBox.textContent = 'Final corrected MSL pressure: -- hPa';
                code += '4////';
            }

            code += ' ';

            if (charVal !== 'not_measured' && !isNaN(amountVal)) {
                const a = charVal;
                const ppp = Math.round(amountVal * 10).toString().padStart(3, '0');
                code += `5${a}${ppp}`;
            } else {
                code += '5////';
            }

            store.updateFormData('pressure_tendency_code', code);
            updatePreview(group);
        }

        updateVisibility();
        updateValues();
    },

    renderSwellComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '', step = '1', max = '', min = undefined) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            
            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.htmlFor = id;
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = type;
            inp.id = id;
            inp.style.width = width;
            inp.value = formData[id] || '';
            if (step) inp.step = step;
            if (max) inp.max = max;
            if (min !== undefined) inp.min = min;
            
            inp.addEventListener('input', (e) => {
                const val = e.target.value;
                if (type === 'number' && val !== '') {
                    const numVal = parseFloat(val);
                    if (min !== undefined && numVal < min) {
                        inp.setCustomValidity(`Value must be >= ${min}`);
                    } else if (max !== '' && numVal > parseFloat(max)) {
                        inp.setCustomValidity(`Value must be <= ${max}`);
                    } else {
                        inp.setCustomValidity('');
                    }
                    inp.reportValidity();
                }
                store.updateFormData(id, val);
                updateSwellValues();
            });
            wrapper.appendChild(inp);

            if (help) {
                const h = document.createElement('div');
                h.className = 'help-text';
                h.textContent = help;
                wrapper.appendChild(h);
            }
            return { wrapper, inp };
        };

        const sitWrapper = document.createElement('div');
        sitWrapper.className = 'input-group';
        const sitLabel = document.createElement('label');
        sitLabel.textContent = 'Swell Situation';
        sitWrapper.appendChild(sitLabel);

        const sitSelect = document.createElement('select');
        sitSelect.id = 'swell_situation';
        const sitOptions = [
            { value: 'a', label: 'Swell not determined' },
            { value: 'b', label: 'No swell' },
            { value: 'c', label: 'Confused swell' },
            { value: 'd', label: 'One swell discernable' },
            { value: 'e', label: 'Two swells discernable' }
        ];
        sitOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            sitSelect.appendChild(option);
        });
        sitSelect.value = formData['swell_situation'] || 'a';
        sitSelect.addEventListener('change', (e) => {
            store.updateFormData('swell_situation', e.target.value);
            updateVisibility();
            updateSwellValues();
        });
        sitWrapper.appendChild(sitSelect);
        container.appendChild(sitWrapper);

        const inputsContainer = document.createElement('div');
        container.appendChild(inputsContainer);

        // Helper for Direction Input (Reused logic)
        const createDirectionInput = (id, label) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            const lbl = document.createElement('label');
            lbl.textContent = label;
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = 'text';
            inp.id = id;
            inp.placeholder = 'Degrees (0-360) or 0=Calm, 99=Confused';

            // Initial Value
            const currentDir = formData[id];
            if (currentDir === '0' || currentDir === '00') inp.value = 'Calm (0)';
            else if (currentDir === '99') inp.value = 'Confused (99)';
            else if (currentDir) inp.value = `${parseInt(currentDir) * 10}`;

            inp.addEventListener('change', (e) => {
                let val = e.target.value.trim().toLowerCase();
                let code = '';
                let display = '';

                if (val === 'calm' || val === '0' || val === '00') {
                    code = '00';
                    display = 'Calm (0)';
                } else if (val === 'confused' || val === 'var' || val === '99') {
                    code = '99';
                    display = 'Confused (99)';
                } else {
                    const num = parseFloat(val);
                    if (!isNaN(num)) {
                        if (num >= 0 && num <= 360) {
                            let tens = Math.round(num / 10);
                            if (tens === 0) {
                                code = '00';
                                display = 'Calm (0)';
                            } else {
                                code = tens.toString().padStart(2, '0');
                                display = `${num}° (Code: ${code})`;
                            }
                        } else {
                            alert('Direction must be 0-360');
                            e.target.value = '';
                            return;
                        }
                    } else {
                        return;
                    }
                }
                store.updateFormData(id, code);
                e.target.value = display;
                updateSwellValues();
            });

            inp.addEventListener('focus', (e) => {
                const val = store.getFormData()[id];
                if (val === '00') e.target.value = '0';
                else if (val === '99') e.target.value = '99';
                else if (val) e.target.value = parseInt(val) * 10;
                else e.target.value = '';
            });

            wrapper.appendChild(inp);
            const h = document.createElement('div');
            h.className = 'help-text';
            h.textContent = 'Input degrees (0-360). 0=Calm, 99=Confused.';
            wrapper.appendChild(h);
            
            return { wrapper, inp };
        };

        const s1Dir = createDirectionInput('swell1_dir', 'Primary Swell Direction');
        const s1Per = createInput('swell1_period', 'Primary Swell Period [1 - 50 Seconds]', 'number', '100%', '/: Not determined.', '1', '50', 0);
        const s1Hgt = createInput('swell1_height', 'Primary Swell Height [0.5 - 49.0 Meters]', 'number', '100%', 'Input in meters (e.g. 2.5).', '0.1', '49', 0);

        const s2Dir = createDirectionInput('swell2_dir', 'Secondary Swell Direction');
        const s2Per = createInput('swell2_period', 'Secondary Swell Period [1 - 50 Seconds]', 'number', '100%', '/: Not determined.', '1', '50', 0);
        const s2Hgt = createInput('swell2_height', 'Secondary Swell Height [0.5 - 49.0 Meters]', 'number', '100%', 'Input in meters (e.g. 2.5).', '0.1', '49', 0);

        [s1Dir, s1Per, s1Hgt, s2Dir, s2Per, s2Hgt].forEach(el => {
            el.wrapper.style.display = 'none';
            inputsContainer.appendChild(el.wrapper);
        });

        function updateVisibility() {
            const fd = store.getFormData();
            const sit = fd['swell_situation'] || 'a';
            
            [s1Dir, s1Per, s1Hgt, s2Dir, s2Per, s2Hgt].forEach(el => el.wrapper.style.display = 'none');

            if (sit === 'c') {
                s1Per.wrapper.style.display = 'block';
                s1Hgt.wrapper.style.display = 'block';
            } else if (sit === 'd') {
                s1Dir.wrapper.style.display = 'block';
                s1Per.wrapper.style.display = 'block';
                s1Hgt.wrapper.style.display = 'block';
            } else if (sit === 'e') {
                s1Dir.wrapper.style.display = 'block';
                s1Per.wrapper.style.display = 'block';
                s1Hgt.wrapper.style.display = 'block';
                s2Dir.wrapper.style.display = 'block';
                s2Per.wrapper.style.display = 'block';
                s2Hgt.wrapper.style.display = 'block';
            }
        }

        function transformHeight(val) {
            if (val === '/' || val === '') return '/';
            const num = parseFloat(val);
            if (isNaN(num)) return '/';
            return Math.round(num * 2).toString();
        }

        function padValue(val, width) {
            if (val === undefined || val === '') return '';
            if (val === '/') return '/'.repeat(width);
            return val.toString().padStart(width, '0');
        }

        function updateSwellValues() {
            const fd = store.getFormData();
            const sit = fd['swell_situation'] || 'a';
            let code = '';

            if (sit === 'a' || sit === 'b') {
                // No groups
            } else if (sit === 'c') {
                code += '399// ';
                const p1 = padValue(fd['swell1_period'], 2);
                const h1 = padValue(transformHeight(fd['swell1_height']), 2);
                if (p1 && h1) code += `4${p1}${h1}`;
                else code += '4////';
            } else if (sit === 'd') {
                const d1 = padValue(fd['swell1_dir'], 2);
                if (d1) code += `3${d1}// `;
                else code += '3//// ';
                const p1 = padValue(fd['swell1_period'], 2);
                const h1 = padValue(transformHeight(fd['swell1_height']), 2);
                if (p1 && h1) code += `4${p1}${h1}`;
                else code += '4////';
            } else if (sit === 'e') {
                const d1 = padValue(fd['swell1_dir'], 2);
                const d2 = padValue(fd['swell2_dir'], 2);
                if (d1 && d2) code += `3${d1}${d2} `;
                else code += '3//// ';
                const p1 = padValue(fd['swell1_period'], 2);
                const h1 = padValue(transformHeight(fd['swell1_height']), 2);
                if (p1 && h1) code += `4${p1}${h1} `;
                else code += '4//// ';
                const p2 = padValue(fd['swell2_period'], 2);
                const h2 = padValue(transformHeight(fd['swell2_height']), 2);
                if (p2 && h2) code += `5${p2}${h2}`;
                else code += '5////';
            }

            store.updateFormData('swell_code', code.trim());
            updatePreview(group);
        }

        updateVisibility();
        updateSwellValues();
    },

    renderSeaTempComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '', min = undefined, max = undefined) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            
            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.htmlFor = id;
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = type;
            inp.id = id;
            inp.style.width = width;
            inp.value = formData[id] || '';
            inp.step = '0.1';
            if (min !== undefined) inp.min = min;
            if (max !== undefined) inp.max = max;

            inp.addEventListener('input', (e) => {
                const val = e.target.value;
                if (type === 'number' && val !== '') {
                    const numVal = parseFloat(val);
                    if (min !== undefined && numVal < min) {
                        inp.setCustomValidity(`Value must be >= ${min}`);
                    } else if (max !== undefined && numVal > max) {
                        inp.setCustomValidity(`Value must be <= ${max}`);
                    } else {
                        inp.setCustomValidity('');
                    }
                    inp.reportValidity();
                }
                store.updateFormData(id, val);
                updateValues();
            });
            wrapper.appendChild(inp);

            if (help) {
                const h = document.createElement('div');
                h.className = 'help-text';
                h.textContent = help;
                wrapper.appendChild(h);
            }
            return { wrapper, inp };
        };

        const methodWrapper = document.createElement('div');
        methodWrapper.className = 'input-group';
        const methodLabel = document.createElement('label');
        methodLabel.textContent = 'Method (ss)';
        methodWrapper.appendChild(methodLabel);

        const methodSelect = document.createElement('select');
        methodSelect.id = 'sst_method';
        const methods = [
            { value: '/', label: '/: Not determined' },
            { value: 'intake', label: 'Intake measurement' },
            { value: 'bucket', label: 'Bucket measurement' },
            { value: 'hull', label: 'Hull contact sensor' }
        ];
        methods.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.value;
            opt.textContent = m.label;
            methodSelect.appendChild(opt);
        });
        methodSelect.value = formData['sst_method'] || '/';
        methodSelect.addEventListener('change', (e) => {
            store.updateFormData('sst_method', e.target.value);
            localStorage.setItem('vos_sst_method', e.target.value);
            updateVisibility();
            updateValues();
        });
        methodWrapper.appendChild(methodSelect);
        container.appendChild(methodWrapper);

        const tempInput = createInput('sst_temp', 'Temp (TwTwTw) [-2.0 - 50.0 °C]', 'number', '100%', 'e.g. 24.5', -2.0, 50.0);
        container.appendChild(tempInput.wrapper);

        function updateVisibility() {
            const fd = store.getFormData();
            const method = fd['sst_method'] || '/';
            if (method === '/') {
                tempInput.inp.disabled = true;
                tempInput.inp.value = '';
                store.updateFormData('sst_temp', '');
            } else {
                tempInput.inp.disabled = false;
            }
        }

        function updateValues() {
            const fd = store.getFormData();
            const method = fd['sst_method'] || '/';
            const tempVal = parseFloat(fd['sst_temp']);

            let code = '';

            if (method !== '/' && !isNaN(tempVal)) {
                let ss = '';
                const isNegative = tempVal < 0;
                
                if (method === 'intake') {
                    ss = isNegative ? '1' : '0';
                } else if (method === 'bucket') {
                    ss = isNegative ? '3' : '2';
                } else if (method === 'hull') {
                    ss = isNegative ? '5' : '4';
                }

                const t = Math.round(Math.abs(tempVal) * 10).toString().padStart(3, '0');
                code = `0${ss}${t}`;
            }

            store.updateFormData('sea_temp_code', code);
            updatePreview(group);
        }

        updateVisibility();
        updateValues();
    },

    renderWindWavesComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '', min = undefined, max = undefined, step = '1') => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            
            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.htmlFor = id;
            wrapper.appendChild(lbl);

            const inp = document.createElement('input');
            inp.type = type;
            inp.id = id;
            inp.style.width = width;
            inp.value = formData[id] || '';
            inp.step = step;
            if (min !== undefined) inp.min = min;
            if (max !== undefined) inp.max = max;

            inp.addEventListener('input', (e) => {
                const val = e.target.value;
                if (type === 'number' && val !== '') {
                    const numVal = parseFloat(val);
                    if (min !== undefined && numVal < min) {
                        inp.setCustomValidity(`Value must be >= ${min}`);
                    } else if (max !== undefined && numVal > max) {
                        inp.setCustomValidity(`Value must be <= ${max}`);
                    } else {
                        inp.setCustomValidity('');
                    }
                    inp.reportValidity();
                }
                store.updateFormData(id, val);
                updateValues();
            });
            wrapper.appendChild(inp);

            if (help) {
                const h = document.createElement('div');
                h.className = 'help-text';
                h.textContent = help;
                wrapper.appendChild(h);
            }
            return { wrapper, inp };
        };

        // Period: 0-50, or 99, or /
        // We can use a select for special values or just text input with validation?
        // User asked for limits.
        // Let's use a number input for 0-50, and a checkbox for "Confused (99)" and "Not Determined (/)"?
        // Or just a smart input like Wind Direction?
        // Let's try Smart Input for Period.

        const periodWrapper = document.createElement('div');
        periodWrapper.className = 'input-group';
        const periodLabel = document.createElement('label');
        periodLabel.textContent = 'Period (PwPw) [0 - 50 Seconds]';
        periodWrapper.appendChild(periodLabel);

        const periodInput = document.createElement('input');
        periodInput.type = 'text';
        periodInput.placeholder = 'Seconds (0-50) or 99=Confused';
        
        const currentPer = formData['wave_period'];
        if (currentPer === '99') periodInput.value = 'Confused (99)';
        else if (currentPer === '/') periodInput.value = 'Not Determined (/)';
        else if (currentPer) periodInput.value = currentPer;

        periodInput.addEventListener('change', (e) => {
            let val = e.target.value.trim().toLowerCase();
            let code = '';
            let display = '';

            if (val === 'confused' || val === '99') {
                code = '99';
                display = 'Confused (99)';
            } else if (val === '/' || val === 'not determined' || val === '') {
                code = '/';
                display = 'Not Determined (/)';
            } else {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                    if (num >= 0 && num <= 50) {
                        code = Math.round(num).toString();
                        display = code;
                    } else {
                        alert('Period must be 0-50');
                        e.target.value = '';
                        return;
                    }
                } else {
                    code = '/';
                    display = 'Not Determined (/)';
                }
            }
            store.updateFormData('wave_period', code);
            e.target.value = display;
            updateValues();
        });
        
        periodInput.addEventListener('focus', (e) => {
            const val = store.getFormData()['wave_period'];
            if (val === '99') e.target.value = '99';
            else if (val === '/') e.target.value = '';
            else e.target.value = val || '';
        });

        periodWrapper.appendChild(periodInput);
        container.appendChild(periodWrapper);

        // Height: 0-49. / allowed.
        const heightInput = createInput('wave_height', 'Height (HwHw) [0.0 - 49.0 Meters]', 'number', '100%', 'Input in meters (e.g. 2.5). Leave empty for Not Determined.', 0, 49, '0.1');
        container.appendChild(heightInput.wrapper);

        function updateValues() {
            const fd = store.getFormData();
            const per = fd['wave_period'] || '/';
            const hgt = fd['wave_height'];

            let code = '';
            
            // 2PwPwHwHw
            // If both are /, skip? Or 2////?
            // Usually if not observed, skip.
            // If one is observed, report.
            
            if (per === '/' && (hgt === undefined || hgt === '')) {
                code = ''; // Skip
            } else {
                let p = per;
                if (p === '/') p = '//';
                else p = p.padStart(2, '0');

                let h = '//';
                if (hgt !== undefined && hgt !== '') {
                    const hVal = parseFloat(hgt);
                    if (!isNaN(hVal)) {
                        h = Math.round(hVal * 2).toString().padStart(2, '0');
                    }
                }
                
                code = `2${p}${h}`;
            }

            store.updateFormData('wind_waves_code', code);
            updatePreview(group);
        }
        
        updateValues();
    },

    renderIceAccretionComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createSelect = (id, label, options) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-group';
            const lbl = document.createElement('label');
            lbl.textContent = label;
            wrapper.appendChild(lbl);
            
            const sel = document.createElement('select');
            sel.id = id;
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                sel.appendChild(o);
            });
            sel.value = formData[id] || '/';
            sel.addEventListener('change', (e) => {
                store.updateFormData(id, e.target.value);
                updateVisibility();
                updateValues();
            });
            wrapper.appendChild(sel);
            return { wrapper, sel };
        };

        const sourceSelect = createSelect('ice_source', 'Cause', [
            { value: '1', label: '1: Icing from ocean spray' },
            { value: '2', label: '2: Icing from fog' },
            { value: '3', label: '3: Icing from spray + fog' },
            { value: '4', label: '4: Icing from rain' },
            { value: '5', label: '5: Icing from spray + rain' },
            { value: '/', label: '/: Not determined' }
        ]);
        container.appendChild(sourceSelect.wrapper);

        const thickWrapper = document.createElement('div');
        thickWrapper.className = 'input-group';
        thickWrapper.innerHTML = '<label>Thickness [0 - 99 cm]</label>';
        const thickInput = document.createElement('input');
        thickInput.type = 'number';
        thickInput.min = 0;
        thickInput.max = 99;
        thickInput.value = formData['ice_thickness'] || '';
        thickInput.addEventListener('input', (e) => {
            store.updateFormData('ice_thickness', e.target.value);
            updateValues();
        });
        thickWrapper.appendChild(thickInput);
        container.appendChild(thickWrapper);

        const rateSelect = createSelect('ice_rate', 'Rate', [
            { value: '0', label: '0: Ice not building up' },
            { value: '1', label: '1: Ice building up slowly' },
            { value: '2', label: '2: Ice building up rapidly' },
            { value: '3', label: '3: Ice melting or breaking up slowly' },
            { value: '4', label: '4: Ice melting or breaking up rapidly' },
            { value: '/', label: '/: Not determined' }
        ]);
        container.appendChild(rateSelect.wrapper);

        function updateVisibility() {
            const fd = store.getFormData();
            const src = fd['ice_source'] || '/';
            if (src === '/') {
                thickInput.disabled = true;
                thickInput.value = '';
                store.updateFormData('ice_thickness', '');
                rateSelect.sel.disabled = true;
                rateSelect.sel.value = '/';
                store.updateFormData('ice_rate', '/');
            } else {
                thickInput.disabled = false;
                rateSelect.sel.disabled = false;
            }
        }

        function updateValues() {
            const fd = store.getFormData();
            const src = fd['ice_source'] || '/';
            const thick = fd['ice_thickness'];
            const rate = fd['ice_rate'] || '/';

            let code = '';

            if (src !== '/') {
                // 6IsEsRs
                // Is = source
                // Es = thickness in cm
                // Rs = rate
                
                let es = '//';
                if (thick !== undefined && thick !== '') {
                    es = parseInt(thick).toString().padStart(2, '0');
                }
                
                code = `6${src}${es}${rate}`;
            }

            store.updateFormData('ice_accretion_code', code);
            updatePreview(group);
        }

        updateVisibility();
        updateValues();
    }
};
