class ReportStore {
    constructor() {
        this.state = {
            currentStepIndex: 0,
            formData: {},
            isReviewMode: false,
            returnToReview: false
        };
        this.listeners = [];
        this.loadPersistedData();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    updateFormData(key, value) {
        this.state.formData[key] = value;
        // Persist if needed (checking fields would require looking up the field definition, 
        // but for simplicity we can just persist specific known keys or check the field definition in the UI layer)
        // For now, we'll handle persistence in the UI layer or here if we pass the field config.
        // To keep it simple and fast, we'll just update the state here.
        this.notify();
    }

    loadPersistedData() {
        const savedCallsign = localStorage.getItem('vos_callsign');
        if (savedCallsign) {
            this.state.formData['callsign'] = savedCallsign;
        }
        const savedEmail = localStorage.getItem('vos_email_recipient');
        if (savedEmail) {
            this.state.formData['email_recipient'] = savedEmail;
        }
        const savedWindInd = localStorage.getItem('vos_wind_indicator');
        if (savedWindInd) {
            this.state.formData['wind_indicator'] = savedWindInd;
        }
        const savedThMode = localStorage.getItem('vos_th_mode');
        if (savedThMode) {
            this.state.formData['th_mode'] = savedThMode;
        }
        const savedSstMethod = localStorage.getItem('vos_sst_method');
        if (savedSstMethod) {
            this.state.formData['sst_method'] = savedSstMethod;
        }
        const savedPtCorrection = localStorage.getItem('vos_pt_correction');
        if (savedPtCorrection) {
            this.state.formData['pt_correction'] = savedPtCorrection;
        }
        const savedPtIsMsl = localStorage.getItem('vos_pt_is_msl');
        if (savedPtIsMsl) {
            this.state.formData['pt_is_msl'] = savedPtIsMsl;
        }
        const savedPtKeelDist = localStorage.getItem('vos_pt_keel_dist');
        if (savedPtKeelDist) {
            this.state.formData['pt_keel_dist'] = savedPtKeelDist;
        }
    }

    getFormData() {
        return this.state.formData;
    }

    getCurrentStep() {
        return this.state.currentStepIndex;
    }

    generateGroupCode(group) {
        let code = '';
        let isValid = true;
        const formData = this.state.formData;

        // Special skip logic for Sea Ice
        if (group.id === 'ice_data') {
            const iceConc = formData['ice_conc'];
            if (iceConc === '/' || iceConc === undefined) {
                return '...';
            }
        }

        for (const field of group.fields) {
            if (field.excludeFromCode) continue;

            let val = formData[field.id];
            
            if (field.type === 'static') {
                code += field.value;
                continue;
            }

            if (val === undefined || val === '') {
                if (field.default !== undefined) {
                    val = field.default;
                } else {
                    isValid = false;
                    break; // Incomplete
                }
            }

            // Transform logic
            if (field.transform) {
                val = field.transform(val);
            }

            // Padding logic
            if (field.pad && field.width) {
                if (val === '/') {
                    val = '/'.repeat(field.width);
                } else {
                    val = val.toString().padStart(field.width, '0');
                }
            }
            
            // Truncate if too long (basic safety)
            if (field.width && val.length > field.width) {
                val = val.substring(0, field.width);
            }

            code += val;
        }

        return isValid ? code : '...';
    }

    generateFullReport() {
        let groups = [];
        let wetBulbGroup = null;
        let marineHeaderCode = '';

        // Create a sorted copy of the structure based on wmoOrder
        const sortedStructure = [...REPORT_STRUCTURE].sort((a, b) => {
            return (a.wmoOrder || 0) - (b.wmoOrder || 0);
        });

        sortedStructure.forEach(group => {
            // Skip logic for Present & Past Weather
            if (group.id === 'present_past_weather' && this.state.formData['weather_indicator'] === '2') {
                return;
            }

            let code = this.generateGroupCode(group);
            
            // Special handling for Position group to split Marine Header (222DsVs)
            if (group.id === 'position' && code !== '...') {
                // Look for the spacer ' 222'
                const splitIndex = code.indexOf(' 222');
                if (splitIndex !== -1) {
                    const posCode = code.substring(0, splitIndex);
                    marineHeaderCode = code.substring(splitIndex + 1); // "222..."
                    code = posCode;
                }
            }

            // Special handling for Wet Bulb group (8swTbTbTb)
            if (group.id === 'temp_humidity' && code !== '...') {
                const match = code.match(/ (8\d{4})$/);
                if (match) {
                    wetBulbGroup = match[1];
                    code = code.replace(/ 8\d{4}$/, '');
                }
            }

            if (code !== '...' && code !== '') {
                groups.push({ id: group.id, code: code, section: group.section });
            }
        });

        let report = '';
        let wetBulbInserted = false;
        let marineHeaderInserted = false;

        groups.forEach(g => {
            // Insert Marine Header before the first Section 2 group
            if (marineHeaderCode && !marineHeaderInserted && g.section === 2) {
                report += marineHeaderCode + ' ';
                marineHeaderInserted = true;
            }

            if (wetBulbGroup && !wetBulbInserted && g.id === 'ice_data') {
                report += wetBulbGroup + ' ';
                wetBulbInserted = true;
            }
            report += g.code + ' ';
        });

        // Fallbacks
        if (marineHeaderCode && !marineHeaderInserted) {
             report += marineHeaderCode + ' ';
        }
        if (wetBulbGroup && !wetBulbInserted) {
            report += wetBulbGroup + ' ';
        }

        return report.trim() + '=';
    }
}
