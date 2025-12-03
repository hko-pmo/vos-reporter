// Initialize Store
const store = new ReportStore();

// DOM Elements
const appContainer = document.getElementById('wizard-content');
const stepIndicator = document.getElementById('step-indicator');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnSkip = document.getElementById('btn-skip');
const cloudModal = document.getElementById('cloud-modal');
const closeModalBtn = document.querySelector('.close-modal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Data is loaded in Store constructor
    renderStep();
    setupEventListeners();

    // Modal Close
    if (closeModalBtn) {
        closeModalBtn.onclick = () => cloudModal.classList.add('hidden');
    }
    window.onclick = (event) => {
        if (event.target == cloudModal) {
            cloudModal.classList.add('hidden');
        }
    };
});

function setupEventListeners() {
    btnBack.addEventListener('click', handleBack);
    btnNext.addEventListener('click', handleNext);
    btnSkip.addEventListener('click', handleSkip);
}

function updatePreview(group) {
    // Update Global Preview
    const globalPreview = document.getElementById('global-preview');
    if (globalPreview) {
        globalPreview.textContent = store.generateFullReport();
    }
}

function renderStep() {
    // Clear container
    appContainer.innerHTML = '';

    const currentStepIndex = store.getCurrentStep();
    const formData = store.getFormData();
    const state = store.state; // Access state for flags like returnToReview

    if (currentStepIndex >= REPORT_STRUCTURE.length) {
        renderReviewScreen();
        return;
    }

    const group = REPORT_STRUCTURE[currentStepIndex];
    
    // Update Header
    stepIndicator.textContent = `Step ${currentStepIndex + 1} of ${REPORT_STRUCTURE.length}`;
    
    // Reset Button State
    btnBack.classList.remove('hidden', 'invisible');
    btnSkip.classList.remove('hidden', 'invisible');
    btnNext.classList.remove('hidden', 'invisible');
    btnBack.disabled = false;

    // Update Buttons based on mode
    if (state.returnToReview) {
        // Edit Mode: Hide Back, Show Skip (if optional), Next -> Return
        btnBack.classList.add('invisible');
        btnNext.textContent = 'Return to Review';
    } else {
        // Wizard Mode
        if (currentStepIndex === 0) btnBack.disabled = true;
        btnNext.textContent = 'Next';
    }
    
    // Skip button visibility
    if (group.mandatory) {
        btnSkip.classList.add('invisible');
    }

    // Create Group Container
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group-container';

    // Title & Description
    const title = document.createElement('h2');
    title.className = 'group-title';
    title.textContent = group.name;
    groupDiv.appendChild(title);

    if (group.description) {
        const desc = document.createElement('p');
        desc.className = 'group-description';
        desc.textContent = group.description;
        groupDiv.appendChild(desc);
    }

    // Custom Component Rendering
    if (group.customComponent === 'position-input') {
        Renderers.renderPositionComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'temp-humidity-input') {
        Renderers.renderTempHumidityComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'pressure-tendency-input') {
        Renderers.renderPressureTendencyComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'wind-input') {
        Renderers.renderWindComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'wind-waves-input') {
        Renderers.renderWindWavesComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'sea-temp-input') {
        Renderers.renderSeaTempComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'ice-accretion-input') {
        Renderers.renderIceAccretionComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'present-weather-input') {
        Renderers.renderPresentWeatherComponent(groupDiv, group, store, updatePreview);
    } else if (group.customComponent === 'swell-input') {
        Renderers.renderSwellComponent(groupDiv, group, store, updatePreview);
    } else {
        // Standard Fields Rendering
        group.fields.forEach(field => {
            if (field.hidden || field.type === 'computed') return;

            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            if (field.uiOrder) {
                inputGroup.style.order = field.uiOrder;
            }

            const label = document.createElement('label');
            label.textContent = field.label;
            label.htmlFor = field.id;

            // Add Cloud Chart Button
            if (field.cloudType) {
                const chartBtn = document.createElement('button');
                chartBtn.className = 'show-chart-btn';
                chartBtn.textContent = 'Show Chart';
                chartBtn.type = 'button'; // Prevent form submission
                chartBtn.onclick = () => openCloudModal(field.cloudType, field.id);
                label.appendChild(chartBtn);
            }

            inputGroup.appendChild(label);

            let input;
            if (field.type === 'static') {
                input = document.createElement('input');
                input.type = 'text';
                input.value = field.value;
                input.disabled = true;
            } else if (field.type === 'select') {
                input = document.createElement('select');
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type === 'number' ? 'number' : 'text';
                if (field.min !== undefined) input.min = field.min;
                if (field.max !== undefined) input.max = field.max;
                if (field.step !== undefined) input.step = field.step;
                if (field.uppercase) input.style.textTransform = 'uppercase';
                
                // Restrict input to numeric and dot for number fields
                if (field.type === 'number') {
                    input.addEventListener('keydown', (e) => {
                        // Allow: backspace, delete, tab, escape, enter, dot
                        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
                            // Allow: home, end, left, right
                            (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                        }
                        // Ensure that it is a number and stop the keypress
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                        }
                    });
                }
            }

            input.id = field.id;
            
            // Set value if exists
            if (formData[field.id] !== undefined) {
                input.value = formData[field.id];
            } else if (field.default !== undefined) {
                input.value = field.default;
            }

            // Initialize formData with the current value (important for dropdowns default selection)
            if (formData[field.id] === undefined && (field.type === 'select' || input.value !== '')) {
                store.updateFormData(field.id, input.value);
            }

            // Event Listener for Live Preview
            const updateHandler = (e) => {
                let val = e.target.value;
                if (field.uppercase) val = val.toUpperCase();
                
                // Validation for number fields
                if (field.type === 'number' && val !== '') {
                    const numVal = parseFloat(val);
                    if (field.min !== undefined && numVal < field.min) {
                        // Optional: Visual feedback or clamping
                        // For now, we allow typing but maybe show red border?
                        // Or we can enforce on blur.
                        input.setCustomValidity(`Value must be >= ${field.min}`);
                    } else if (field.max !== undefined && numVal > field.max) {
                        input.setCustomValidity(`Value must be <= ${field.max}`);
                    } else {
                        input.setCustomValidity('');
                    }
                    input.reportValidity();
                }

                store.updateFormData(field.id, val);
                
                if (field.persist) localStorage.setItem(`vos_${field.id}`, val);
                updatePreview(group);
            };

            input.addEventListener('input', updateHandler);
            input.addEventListener('change', updateHandler); // For select elements

            inputGroup.appendChild(input);

            if (field.help) {
                const help = document.createElement('div');
                help.className = 'help-text';
                help.textContent = field.help;
                inputGroup.appendChild(help);
            }

            groupDiv.appendChild(inputGroup);
        });
    }

    appContainer.appendChild(groupDiv);
    updatePreview(group);
    
    // Show Global Preview
    const globalPreview = document.getElementById('global-preview');
    if (globalPreview) {
        if (currentStepIndex === 0) {
            globalPreview.style.display = 'none';
        } else {
            globalPreview.style.display = 'flex';
        }
    }
}

function handleNext() {
    const currentStepIndex = store.getCurrentStep();
    const group = REPORT_STRUCTURE[currentStepIndex];
    const code = store.generateGroupCode(group);

    if (group.mandatory && code === '...') {
        alert('Please complete all fields in this mandatory group.');
        return;
    }

    const state = store.state;
    if (state.returnToReview) {
        store.setState({
            returnToReview: false,
            currentStepIndex: REPORT_STRUCTURE.length
        });
        renderStep();
    } else {
        let nextIndex = currentStepIndex + 1;
        
        // Skip groups marked as defaultSkipped
        while (
            nextIndex < REPORT_STRUCTURE.length && 
            REPORT_STRUCTURE[nextIndex].defaultSkipped
        ) {
            nextIndex++;
        }

        // Special Skip Logic for Present & Past Weather
        if (
            nextIndex < REPORT_STRUCTURE.length &&
            REPORT_STRUCTURE[nextIndex].id === 'present_past_weather' &&
            store.getFormData()['weather_indicator'] === '2'
        ) {
            // Clear data for this group
            REPORT_STRUCTURE[nextIndex].fields.forEach(f => {
                if (f.type !== 'static') store.updateFormData(f.id, undefined);
            });
            nextIndex++;
        }
        
        store.setState({ currentStepIndex: nextIndex });
        renderStep();
    }
}

function handleBack() {
    const currentStepIndex = store.getCurrentStep();
    if (currentStepIndex > 0) {
        store.setState({ currentStepIndex: currentStepIndex - 1 });
        renderStep();
    }
}

function handleSkip() {
    const currentStepIndex = store.getCurrentStep();
    const group = REPORT_STRUCTURE[currentStepIndex];
    
    // Clear data for this group
    group.fields.forEach(f => {
        if (f.type !== 'static') store.updateFormData(f.id, undefined);
    });
    
    const state = store.state;
    if (state.returnToReview) {
        store.setState({
            returnToReview: false,
            currentStepIndex: REPORT_STRUCTURE.length
        });
        renderStep();
    } else {
        let nextIndex = currentStepIndex + 1;
        
        // Skip groups marked as defaultSkipped
        while (
            nextIndex < REPORT_STRUCTURE.length && 
            REPORT_STRUCTURE[nextIndex].defaultSkipped
        ) {
            nextIndex++;
        }
        
        store.setState({ currentStepIndex: nextIndex });
        renderStep();
    }
}

function renderReviewScreen() {
    // Hide Global Preview
    const globalPreview = document.getElementById('global-preview');
    if (globalPreview) globalPreview.style.display = 'none';
    
    // Hide nav buttons
    btnBack.classList.add('hidden');
    btnSkip.classList.add('hidden');
    btnNext.classList.add('hidden');

    appContainer.innerHTML = '';
    
    const container = document.createElement('div');
    
    // Full String
    const fullString = store.generateFullReport();
    const stringBox = document.createElement('div');
    stringBox.className = 'final-string-box';
    stringBox.textContent = fullString;
    container.appendChild(stringBox);

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy to Clipboard';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(fullString).then(() => {
            alert('Copied to clipboard!');
        });
    };
    container.appendChild(copyBtn);

    // Mail Button
    const mailBtn = document.createElement('button');
    mailBtn.className = 'mail-btn';
    mailBtn.textContent = 'Send via Email (will launch mail client)';
    mailBtn.onclick = () => {
        const recipient = store.getFormData()['email_recipient'] || '';
        const subject = 'OBS email';
        const body = encodeURIComponent(fullString);
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    };
    container.appendChild(mailBtn);

    // Breakdown List
    const list = document.createElement('div');
    
    // Help Text
    const helpText = document.createElement('p');
    helpText.style.fontSize = '0.9rem';
    helpText.style.color = '#666';
    helpText.style.fontStyle = 'italic';
    helpText.style.marginBottom = '1rem';
    helpText.textContent = 'Note: Some sections may have been automatically skipped. You can click "Add" to include them.';
    container.appendChild(helpText);

    REPORT_STRUCTURE.forEach((group, index) => {
        const code = store.generateGroupCode(group);
        const isSkipped = code === '...' && !group.mandatory;

        const item = document.createElement('div');
        item.className = 'review-item';
        if (isSkipped) item.classList.add('skipped');
        
        const label = document.createElement('span');
        label.textContent = group.name;
        
        const codeSpan = document.createElement('span');
        codeSpan.className = 'code';
        codeSpan.textContent = isSkipped ? '(Skipped)' : code;

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = isSkipped ? 'Add' : 'Edit';
        editBtn.onclick = () => {
            store.setState({
                currentStepIndex: index,
                returnToReview: true
            });
            // Restore nav buttons
            btnBack.classList.remove('hidden');
            btnNext.classList.remove('hidden');
            renderStep();
        };

        item.appendChild(label);
        item.appendChild(codeSpan);
        item.appendChild(editBtn);
        list.appendChild(item);
    });
    container.appendChild(list);

    // Start Over Button
    const startOverBtn = document.createElement('button');
    startOverBtn.className = 'nav-btn secondary';
    startOverBtn.style.marginTop = '2rem';
    startOverBtn.style.width = '100%';
    startOverBtn.textContent = 'Start New Report';
    startOverBtn.onclick = () => {
        if(confirm('Start a new report? Current data will be lost.')) {
            // Keep callsign
            const formData = store.getFormData();
            const callsign = formData['callsign'];
            
            // Reset store
            const newState = {
                currentStepIndex: 0,
                formData: {},
                returnToReview: false,
                isReviewMode: false
            };
            if(callsign) newState.formData['callsign'] = callsign;
            
            store.setState(newState);
            
            btnBack.classList.remove('hidden');
            btnNext.classList.remove('hidden');
            renderStep();
        }
    };
    container.appendChild(startOverBtn);

    appContainer.appendChild(container);
}

function openCloudModal(type, fieldId) {
    const details = CLOUD_DETAILS[type];
    if (!details) return;

    const modalTitle = document.getElementById('modal-title');
    const modalGrid = document.getElementById('modal-grid');
    
    modalTitle.textContent = details.title;
    modalGrid.innerHTML = '';

    Object.keys(details.types).forEach(key => {
        const typeInfo = details.types[key];
        const card = document.createElement('div');
        card.className = 'cloud-card';
        card.onclick = () => {
            // Select value in dropdown
            const select = document.getElementById(fieldId);
            if (select) {
                select.value = key;
                // Trigger change event
                select.dispatchEvent(new Event('change'));
            }
            cloudModal.classList.add('hidden');
        };

        // Image(s)
        if (typeInfo.images && typeInfo.images.length > 0) {
            typeInfo.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Type ${key}`;
                img.loading = 'lazy';
                card.appendChild(img);
            });
        }

        const codeDiv = document.createElement('div');
        codeDiv.className = 'cloud-code';
        codeDiv.textContent = `Code: ${key}`;
        card.appendChild(codeDiv);

        const descDiv = document.createElement('div');
        descDiv.className = 'cloud-desc';
        descDiv.textContent = typeInfo.desc;
        card.appendChild(descDiv);

        const creditDiv = document.createElement('div');
        creditDiv.className = 'cloud-credit';
        creditDiv.textContent = typeInfo.credit;
        card.appendChild(creditDiv);

        modalGrid.appendChild(card);
    });

    cloudModal.classList.remove('hidden');
}
