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

        REPORT_STRUCTURE.forEach(group => {
            // Skip logic for Present & Past Weather
            if (group.id === 'present_past_weather' && this.state.formData['weather_indicator'] === '2') {
                return;
            }

            let code = this.generateGroupCode(group);
            
            // Special handling for Wet Bulb group (8swTbTbTb)
            if (group.id === 'temp_humidity' && code !== '...') {
                const match = code.match(/ (8\d{4})$/);
                if (match) {
                    wetBulbGroup = match[1];
                    code = code.replace(/ 8\d{4}$/, '');
                }
            }

            if (code !== '...') {
                groups.push({ id: group.id, code: code });
            }
        });

        let report = '';
        let wetBulbInserted = false;

        groups.forEach(g => {
            if (wetBulbGroup && !wetBulbInserted && g.id === 'ice_data') {
                report += wetBulbGroup + ' ';
                wetBulbInserted = true;
            }
            report += g.code + ' ';
        });

        if (wetBulbGroup && !wetBulbInserted) {
            report += wetBulbGroup + ' ';
        }

        return report.trim() + '=';
    }
}
