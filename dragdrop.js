// dragAndDrop.js
// Provides drag & drop UI and uploadFile() to send a file to a Google Apps Script endpoint

// --- CONFIGURATION ---
// Replace this with your Apps Script web app URL if needed
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9W-0SdUrzv__gfxidZIfvaOhfqO04vV-5ezCbs3dDR-LPaI73wDcqHe6JB13wfVb6/exec";
// ---------------------

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const dropMessage = document.getElementById('drop-message');
const fileNameDisplay = document.getElementById('file-name');
const statusMsg = document.getElementById('status-message');

let selectedFile = null;

if (dropZone) {
    // 1. Handle Drag & Drop Visuals
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#dbeafe'; // Darker blue on hover
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '#eff6ff'; // Reset
    });

    // 2. Handle File Drop
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#eff6ff';
        
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // 3. Handle Click to Upload
    dropZone.addEventListener('click', () => fileInput && fileInput.click());
}

if (fileInput) {
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });
}
/*
function handleFile(file) {
    selectedFile = file;
    if (dropMessage) dropMessage.innerText = "✅ File Ready:";
    if (fileNameDisplay) fileNameDisplay.innerText = file.name;
    if (dropZone) dropZone.style.borderColor = "#16a34a"; // Green border
}
    */
   function handleFile(file) {
        selectedFile = file;
        
        // 1. Visual update (Green border & Name)
        dropMessage.innerText = "✅ File Selected:";
        fileNameDisplay.innerText = file.name;
        dropZone.style.borderColor = "#16a34a"; 

        // 2. Check File Type for Page Counting
        if (file.type === "application/pdf") {
            // Agar PDF hai, toh count karo
            statusMsg.innerText = "📄 Counting pages...";
            statusMsg.style.color = "blue";
            
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            
            reader.onload = function() {
                const typedarray = new Uint8Array(this.result);
                
                pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                    // Page count mil gaya!
                    const count = pdf.numPages;
                    
                    // Input box update karo
                    document.getElementById('pages').value = count;
                    
                    // Price wapis calculate karo
                    calculateTotal(); 
                    
                    statusMsg.innerText = "✅ Pages detected: " + count;
                    statusMsg.style.color = "green";
                });
            };
        } else if (file.type.includes("image")) {
            // Agar Image (JPG/PNG) hai, toh usually 1 page hota hai
            document.getElementById('pages').value = 1;
            calculateTotal();
            statusMsg.innerText = "✅ Image detected (1 Page)";
        } else {
            // Agar Word/DOCX hai
            statusMsg.innerText = "⚠️ Word file detected. Please enter page count manually.";
            statusMsg.style.color = "#d97706"; // Orange color
            document.getElementById('pages').focus(); // Cursor waha bhej do
        }
    }

// Expose uploadFile globally because the page uses onclick="uploadFile()"
function uploadFile() {
    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }

    if (statusMsg) {
        statusMsg.innerText = "⏳ Uploading... Please wait.";
        statusMsg.style.color = "blue";
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    
    reader.onload = function() {
        const rawLog = (reader.result && reader.result.split(',')[1]) || '';

        const dataPayload = {
            filename: selectedFile.name,
            mimeType: selectedFile.type,
            fileData: rawLog
        };

        fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(dataPayload)
        })
        .then(response => response.text())
        .then(() => {
            if (statusMsg) {
                statusMsg.innerText = "🎉 Upload Successful! We have your file.";
                statusMsg.style.color = "green";
            }
            // Optional: Clear file after success
            selectedFile = null;
            if (fileNameDisplay) fileNameDisplay.innerText = '';
            if (dropMessage) dropMessage.innerText = "📂 Drag & Drop files here or click to upload";
            if (dropZone) dropZone.style.borderColor = '';
        })
        .catch(error => {
            console.error('Error:', error);
            if (statusMsg) {
                statusMsg.innerText = "❌ Upload Failed. Please try again.";
                statusMsg.style.color = "red";
            }
        });
    };
}

// attach to window so inline onclick can call it
window.uploadFile = uploadFile;
