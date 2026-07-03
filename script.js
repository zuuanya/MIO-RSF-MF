// Simulated Database
let database = [];
let currentEditId = null;

// Tab Switching Logic
function switchTab(tab) {
    document.getElementById('submit-view').classList.remove('active');
    document.getElementById('manage-view').classList.remove('active');
    document.getElementById('btn-submit-tab').classList.remove('active');
    document.getElementById('btn-manage-tab').classList.remove('active');

    if (tab === 'submit') {
        document.getElementById('submit-view').classList.add('active');
        document.getElementById('btn-submit-tab').classList.add('active');
        if(!currentEditId) {
            document.getElementById('formSubmitBtn').textContent = "Save Record";
        }
    } else {
        document.getElementById('manage-view').classList.add('active');
        document.getElementById('btn-manage-tab').classList.add('active');
        renderTable();
    }
}

// Form Submission (Create & Update)
document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Gather checked request types
    let selectedTypes = [];
    document.querySelectorAll('input[name="reqType"]:checked').forEach(checkbox => {
        if (checkbox.value === 'Others') {
            const otherVal = document.getElementById('othersText').value;
            selectedTypes.push(`Others: ${otherVal}`);
        } else {
            selectedTypes.push(checkbox.value);
        }
    });

    // Build Record Object
    const record = {
        id: currentEditId ? currentEditId : Date.now().toString(),
        date: document.getElementById('reqDate').value,
        controlNo: document.getElementById('controlNo').value,
        officeName: document.getElementById('officeName').value,
        requestTypes: selectedTypes,
        particulars: document.getElementById('particulars').value,
        status: 'Pending',
        signatures: {
            requestedByName: document.getElementById('reqByName').value,
            requestedByDate: document.getElementById('reqByDate').value,
            acceptedByName: document.getElementById('accByName').value,
            acceptedByDate: document.getElementById('accByDate').value,
            mioName: document.getElementById('mioByName').value,
            mioDate: document.getElementById('mioByDate').value,
        }
    };

    if (currentEditId) {
        // Update existing record
        const index = database.findIndex(r => r.id === currentEditId);
        database[index] = record;
        currentEditId = null; // reset
        alert("Record updated successfully!");
    } else {
        // Create new record
        database.push(record);
        alert("Record saved successfully!");
    }

    this.reset();
    document.getElementById('formSubmitBtn').textContent = "Save Record";
});

// Render Dashboard Table (Read)
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    database.forEach(record => {
        const tr = document.createElement('tr');
        
        // Convert array of types into a readable string
        const typesStr = record.requestTypes.join(', ');

        tr.innerHTML = `
            <td>${record.controlNo || 'N/A'}</td>
            <td>${record.date}</td>
            <td>${record.officeName}</td>
            <td>${typesStr.length > 30 ? typesStr.substring(0, 30) + '...' : typesStr}</td>
            <td>${record.status}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editRecord('${record.id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteRecord('${record.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Edit Logic (Update prep)
function editRecord(id) {
    const record = database.find(r => r.id === id);
    if (!record) return;

    currentEditId = id;
    
    // Populate simple fields
    document.getElementById('reqDate').value = record.date;
    document.getElementById('controlNo').value = record.controlNo;
    document.getElementById('officeName').value = record.officeName;
    document.getElementById('particulars').value = record.particulars;

    // Reset and populate checkboxes
    document.querySelectorAll('input[name="reqType"]').forEach(cb => cb.checked = false);
    document.getElementById('othersText').value = '';

    record.requestTypes.forEach(type => {
        if (type.startsWith('Others:')) {
            document.getElementById('othersCheck').checked = true;
            document.getElementById('othersText').value = type.replace('Others: ', '');
        } else {
            const cb = document.querySelector(`input[name="reqType"][value="${type}"]`);
            if (cb) cb.checked = true;
        }
    });

    // Populate signatures
    document.getElementById('reqByName').value = record.signatures.requestedByName;
    document.getElementById('reqByDate').value = record.signatures.requestedByDate;
    document.getElementById('accByName').value = record.signatures.acceptedByName;
    document.getElementById('accByDate').value = record.signatures.acceptedByDate;
    document.getElementById('mioByName').value = record.signatures.mioName;
    document.getElementById('mioByDate').value = record.signatures.mioDate;

    // Switch UI
    document.getElementById('formSubmitBtn').textContent = "Update Record";
    switchTab('submit');
}

// Delete Logic
function deleteRecord(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        database = database.filter(r => r.id !== id);
        renderTable();
    }
}