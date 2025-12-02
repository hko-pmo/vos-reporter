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
        
        latFlex.appendChild(createInput('pos_lat_deg', 'Degrees'));
        latFlex.appendChild(createInput('pos_lat_min', 'Minutes'));
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

        longFlex.appendChild(createInput('pos_long_deg', 'Degrees'));
        longFlex.appendChild(createInput('pos_long_min', 'Minutes'));
        // Horizontal layout for Longitude: West then East
        longFlex.appendChild(createRadio('pos_long_dir', 'long_dir', [
            { value: 'W', label: 'West' },
            { value: 'E', label: 'East' }
        ], true));
        longRow.appendChild(longFlex);
        container.appendChild(longRow);

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

    renderTempHumidityComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '') => {
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
            inp.addEventListener('input', (e) => {
                store.updateFormData(id, e.target.value);
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

        const airTemp = createInput('th_air_val', 'Air Temperature (Dry-bulb) [-50.0 - 60.0°C]', 'number', '100%', 'e.g. 24.5');
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

    renderPressureTendencyComponent: (container, group, store, updatePreview) => {
        const formData = store.getFormData();

        const createInput = (id, label, type = 'number', width = '100%', help = '') => {
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
            inp.addEventListener('input', (e) => {
                store.updateFormData(id, e.target.value);
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

        const pressInput = createInput('pt_pressure', 'Pressure [860.0 - 1070.0 hPa]', 'number', '100%', 'e.g. 1014.2. Leave empty if not measured.');
        container.appendChild(pressInput.wrapper);

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

        const amountInput = createInput('pt_amount', 'Amount of Change [0.0 - 50.0 hPa]', 'number', '100%', 'Change in last 3 hours, e.g. 1.4 hPa. No negative numbers. Use "Characteristic" to indicate sign.');
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

        function updateValues() {
            const fd = store.getFormData();
            const pressVal = parseFloat(fd['pt_pressure']);
            const charVal = fd['pt_char'] || 'not_measured';
            const amountVal = parseFloat(fd['pt_amount']);

            let code = '';

            if (!isNaN(pressVal)) {
                const pVal = Math.round(pressVal * 10) % 10000;
                code += `4${pVal.toString().padStart(4, '0')}`;
            } else {
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

        const createInput = (id, label, type = 'number', width = '100%', help = '', step = '1', max = '') => {
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
            
            inp.addEventListener('input', (e) => {
                store.updateFormData(id, e.target.value);
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

        const s1Dir = createInput('swell1_dir', 'Primary Swell Direction (Tens)', 'number', '100%', '01-36. 00: Calm. 99: Confused. /: Unknown.', '1', '99');
        const s1Per = createInput('swell1_period', 'Primary Swell Period (Seconds)', 'text', '100%', '/: Not determined.');
        const s1Hgt = createInput('swell1_height', 'Primary Swell Height (Meters)', 'text', '100%', 'Input in meters (e.g. 2.5).', '0.1', '49');

        const s2Dir = createInput('swell2_dir', 'Secondary Swell Direction (Tens)', 'number', '100%', '01-36. 00: Calm. 99: Confused. /: Unknown.', '1', '99');
        const s2Per = createInput('swell2_period', 'Secondary Swell Period (Seconds)', 'text', '100%', '/: Not determined.');
        const s2Hgt = createInput('swell2_height', 'Secondary Swell Height (Meters)', 'text', '100%', 'Input in meters (e.g. 2.5).', '0.1', '49');

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
    }
};
