document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employeeForm');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const toast = document.getElementById('toast');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const historyList = document.getElementById('historyList');
    const searchInput = document.getElementById('searchInput');

    let currentPhotoBase64 = '';

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabId}Section`).classList.add('active');
            
            if (tabId === 'history') {
                renderHistory();
            }
        });
    });

    // Handle photo preview and conversion to Base64 for persistence
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentPhotoBase64 = e.target.result;
                photoPreview.innerHTML = `<img src="${currentPhotoBase64}" alt="Preview">`;
            }
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate photo
        if (!currentPhotoBase64) {
            // alert('Silakan unggah foto terlebih dahulu.');
            // make photo optional per user request
        }

        // Validation: Required Fields
        const requiredFields = [
            { id: 'fullName', name: 'Nama Lengkap Sesuai KTP' },
            { id: 'address', name: 'Alamat Rumah Lengkap' },
            { id: 'phone', name: 'Nomor Telepon Pribadi' },
            { id: 'email', name: 'Email Pribadi' },
            { id: 'position', name: 'Jabatan' }
        ];

        let hasError = false;
        let firstErrorInput = null;

        // Reset previous errors
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input.value.trim()) {
                input.classList.add('error');
                hasError = true;
                if (!firstErrorInput) firstErrorInput = input;
            }
        });

        if (hasError) {
            // Open the accordion section containing the error if it's closed
            const section = firstErrorInput.closest('details');
            if (section && !section.hasAttribute('open')) {
                section.setAttribute('open', '');
            }
            
            firstErrorInput.focus();
            alert('Mohon lengkapi semua data wajib (ditandai dengan tulisan Wajib berwarna merah).');
            return;
        }

        const formData = {
            id: Date.now(),
            // Main Required
            fullName: document.getElementById('fullName').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            position: document.getElementById('position').value,
            
            // Section 1
            nickname: document.getElementById('nickname').value,
            nik: document.getElementById('nik').value,
            ktp: document.getElementById('ktp').value,
            kk: document.getElementById('kk').value,
            npwp: document.getElementById('npwp').value,
            bpjs: document.getElementById('bpjs').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            maritalStatus: document.getElementById('maritalStatus').value,
            nationality: document.getElementById('nationality').value,
            emergencyName: document.getElementById('emergencyName').value,
            emergencyRel: document.getElementById('emergencyRel').value,
            emergencyPhone: document.getElementById('emergencyPhone').value,

            // Section 2
            department: document.getElementById('department').value,
            costCenter: document.getElementById('costCenter').value,
            employmentStatus: document.getElementById('employmentStatus').value,
            hireDate: document.getElementById('hireDate').value,
            permanentDate: document.getElementById('permanentDate').value,
            contractEnd: document.getElementById('contractEnd').value,
            supervisor: document.getElementById('supervisor').value,
            workLocation: document.getElementById('workLocation').value,

            // Section 3
            baseSalary: document.getElementById('baseSalary').value,
            positionAllowance: document.getElementById('positionAllowance').value,
            mealAllowance: document.getElementById('mealAllowance').value,
            bankName: document.getElementById('bankName').value,
            bankAccount: document.getElementById('bankAccount').value,
            taxDeduction: document.getElementById('taxDeduction').value,
            bpjsDeduction: document.getElementById('bpjsDeduction').value,
            loanDeduction: document.getElementById('loanDeduction').value,

            // Section 4
            leaveBalance: document.getElementById('leaveBalance').value,
            sickLeave: document.getElementById('sickLeave').value,
            unpaidLeave: document.getElementById('unpaidLeave').value,
            maternityLeave: document.getElementById('maternityLeave').value,

            // Section 5
            kpiScore: document.getElementById('kpiScore').value,
            careerHistory: document.getElementById('careerHistory').value,
            trainingHistory: document.getElementById('trainingHistory').value,

            // Section 6
            disciplinaryRecords: document.getElementById('disciplinaryRecords').value,
            
            photo: currentPhotoBase64 || 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23cbd5e1%22 stroke-width=%221%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpath d=%22M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2%22%3e%3c/path%3e%3ccircle cx=%2212%22 cy=%227%22 r=%224%22%3e%3c/circle%3e%3c/svg%3e',
            timestamp: new Date().toLocaleString('id-ID')
        };

        saveToLocalStorage(formData);

        // Show success animation
        const submitBtn = document.getElementById('submitBtn');
        const initialBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('Data berhasil disimpan!');
            employeeForm.reset();
            photoPreview.innerHTML = '<i class="fa-solid fa-camera"></i>';
            currentPhotoBase64 = '';
            submitBtn.innerHTML = initialBtnText;
            submitBtn.disabled = false;
        }, 1200);
    });

    function saveToLocalStorage(data) {
        const history = JSON.parse(localStorage.getItem('employee_history') || '[]');
        history.unshift(data); // Add to beginning
        localStorage.setItem('employee_history', JSON.stringify(history));
    }

    function renderHistory(searchTerm = '') {
        const history = JSON.parse(localStorage.getItem('employee_history') || '[]');
        const filtered = history.filter(item => {
            const name = (item.fullName || '').toLowerCase();
            const pos = (item.position || '').toLowerCase();
            const search = (searchTerm || '').toLowerCase();
            return name.includes(search) || pos.includes(search);
        });

        if (filtered.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>${searchTerm ? 'Tidak ada data yang cocok.' : 'Belum ada data tersimpan.'}</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = filtered.map(item => {
            const address = item.address || '';
            const safeAddress = address.length > 40 ? address.substring(0, 40) + '...' : address;
            
            return `
            <div class="employee-card card-layout-col">
                <div class="card-main-row">
                    <img src="${item.photo}" alt="${item.fullName || 'User'}" class="card-photo" onclick="window.openImage(this.src)" title="Klik untuk memperbesar">
                    <div class="card-info">
                        <div class="card-name">${item.fullName || 'Nama Tidak Tersedia'} <span class="card-nik">${item.nik ? `(${item.nik})` : ''}</span></div>
                        <div class="card-pos">${item.position || '-'} ${item.department ? `- ${item.department}` : ''}</div>
                        <div class="card-detail"><i class="fa-solid fa-phone"></i> ${item.phone || '-'} | <i class="fa-solid fa-envelope" style="margin-left: 5px;"></i> ${item.email || '-'}</div>
                        <div class="card-detail"><i class="fa-solid fa-location-dot"></i> ${safeAddress || '-'}</div>
                    </div>
                    <div class="card-action-group">
                        <button class="export-btn btn-action btn-success" onclick="window.exportToDoc(${item.id})">
                            <i class="fa-solid fa-file-word"></i> Unduh .doc
                        </button>
                        <button class="toggle-btn btn-action btn-outline" onclick="window.toggleDetails(this)">
                            Detail <i class="fa-solid fa-chevron-down" style="margin-left:5px;"></i>
                        </button>
                        <button class="delete-btn btn-action btn-danger" onclick="window.deleteEmployee(${item.id})">
                            <i class="fa-solid fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
                
                <div class="card-extra-details" style="display: none;">
                    <div class="details-grid-container">
                        <div><strong>NIK:</strong> ${item.ktp || '-'}</div>
                        <div><strong>No KK:</strong> ${item.kk || '-'}</div>
                        <div><strong>TTL:</strong> ${item.dob || '-'}</div>
                        <div><strong>Gender:</strong> ${item.gender || '-'}</div>
                        <div><strong>Status Pegawai:</strong> ${item.employmentStatus || '-'}</div>
                        <div><strong>Mulai Kerja:</strong> ${item.hireDate || '-'}</div>
                        <div><strong>Bank:</strong> ${item.bankName || '-'} (${item.bankAccount || '-'})</div>
                        <div><strong>Sisa Cuti:</strong> ${item.leaveBalance ? item.leaveBalance + ' Hari' : '-'}</div>
                        <div><strong>KPI Score:</strong> ${item.kpiScore || '-'}</div>
                        <div><strong>Kontak Darurat:</strong> ${item.emergencyName || '-'} (${item.emergencyPhone || '-'})</div>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // Add a small inline style fix since we added inline script for toggle
        document.querySelectorAll('.card-extra-details.active').forEach(el => el.style.display = 'block');
    }

    // Attach global click for toggle since it's inline
    window.toggleDetails = function(btn) {
        const details = btn.parentElement.parentElement.nextElementSibling;
        if (details.style.display === 'none' || details.style.display === '') {
            details.style.display = 'block';
            btn.innerHTML = 'Tutup <i class="fa-solid fa-chevron-up" style="margin-left:5px;"></i>';
        } else {
            details.style.display = 'none';
            btn.innerHTML = 'Detail <i class="fa-solid fa-chevron-down" style="margin-left:5px;"></i>';
        }
    }

    // Function to delete employee
    window.deleteEmployee = function(id) {
        if(confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
            let history = JSON.parse(localStorage.getItem('employee_history') || '[]');
            history = history.filter(item => item.id !== id);
            localStorage.setItem('employee_history', JSON.stringify(history));
            
            // Re-render the list based on current search term
            const currentSearch = searchInput.value;
            renderHistory(currentSearch);
            showToast('Data berhasil dihapus');
        }
    }

    // Generator for doc file export
    window.exportToDoc = function(id) {
        const history = JSON.parse(localStorage.getItem('employee_history') || '[]');
        const employee = history.find(e => e.id === id);
        if (!employee) {
            alert('Data tidak ditemukan!');
            return;
        }

        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns:v='urn:schemas-microsoft-com:vml' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Data Karyawan - \${employee.fullName || 'Tanpa Nama'}</title>
                <style>
                    body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 10.5pt; color: #1e293b; background-color: #ffffff; line-height: 1.5; }
                    .header-container { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #2563eb; }
                    .company-name { font-size: 16pt; font-weight: bold; color: #0f172a; margin-bottom: 5px; letter-spacing: 0.5px; }
                    .report-title { font-size: 20pt; color: #2563eb; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px;}
                    .report-subtitle { font-size: 11pt; color: #64748b; margin-top: 5px; }
                    
                    h3 { font-size: 12pt; color: #ffffff; background-color: #2563eb; padding: 8px 12px; margin-top: 25px; margin-bottom: 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;}
                    
                    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; border: 1px solid #e2e8f0; page-break-inside: avoid; }
                    th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; vertical-align: top; }
                    td.label { font-weight: 600; width: 35%; background-color: #f8fafc; color: #334155; border-right: 2px solid #e2e8f0; }
                    td.value { color: #0f172a; }
                    
                    .footer { text-align: right; margin-top: 40px; font-size: 9pt; color: #94a3b8; font-style: italic; border-top: 1px solid #e2e8f0; padding-top: 10px;}
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="company-name">DATA MANAJEMEN SDM</div>
                    <div class="report-title">PROFIL KARYAWAN</div>
                    <div class="report-subtitle">Dokumen Rahasia & Internal</div>
                </div>
                
                <h3>1. Data Pribadi dan Identitas</h3>
                <table>
                    <tr><td class="label">Nama Lengkap</td><td class="value">${employee.fullName || '-'}</td></tr>
                    <tr><td class="label">Nama Panggilan</td><td class="value">${employee.nickname || '-'}</td></tr>
                    <tr><td class="label">NIK (Karyawan)</td><td class="value">${employee.nik || '-'}</td></tr>
                    <tr><td class="label">Nomor KTP</td><td class="value">${employee.ktp || '-'}</td></tr>
                    <tr><td class="label">Nomor KK</td><td class="value">${employee.kk || '-'}</td></tr>
                    <tr><td class="label">NPWP</td><td class="value">${employee.npwp || '-'}</td></tr>
                    <tr><td class="label">BPJS (Kes/TK)</td><td class="value">${employee.bpjs || '-'}</td></tr>
                    <tr><td class="label">Alamat Lengkap</td><td class="value">${employee.address || '-'}</td></tr>
                    <tr><td class="label">No. Handphone</td><td class="value">${employee.phone || '-'}</td></tr>
                    <tr><td class="label">Email Pribadi</td><td class="value">${employee.email || '-'}</td></tr>
                    <tr><td class="label">Tanggal Lahir</td><td class="value">${employee.dob || '-'}</td></tr>
                    <tr><td class="label">Jenis Kelamin</td><td class="value">${employee.gender || '-'}</td></tr>
                    <tr><td class="label">Status Pernikahan</td><td class="value">${employee.maritalStatus || '-'}</td></tr>
                    <tr><td class="label">Kewarganegaraan</td><td class="value">${employee.nationality || '-'}</td></tr>
                    <tr><td class="label">Kontak Darurat</td><td class="value">${employee.emergencyName || '-'} (${employee.emergencyRel || '-'}) - ${employee.emergencyPhone || '-'}</td></tr>
                </table>

                <h3>2. Data Pekerjaan dan Kontrak</h3>
                <table>
                    <tr><td class="label">Jabatan</td><td class="value">${employee.position || '-'}</td></tr>
                    <tr><td class="label">Departemen/Divisi</td><td class="value">${employee.department || '-'}</td></tr>
                    <tr><td class="label">Cost Center</td><td class="value">${employee.costCenter || '-'}</td></tr>
                    <tr><td class="label">Status Pegawai</td><td class="value">${employee.employmentStatus || '-'}</td></tr>
                    <tr><td class="label">Tanggal Mulai</td><td class="value">${employee.hireDate || '-'}</td></tr>
                    <tr><td class="label">Tanggal Permanen</td><td class="value">${employee.permanentDate || '-'}</td></tr>
                    <tr><td class="label">Akhir Kontrak</td><td class="value">${employee.contractEnd || '-'}</td></tr>
                    <tr><td class="label">Atasan Langsung</td><td class="value">${employee.supervisor || '-'}</td></tr>
                    <tr><td class="label">Lokasi Kerja</td><td class="value">${employee.workLocation || '-'}</td></tr>
                </table>

                <h3>3. Data Penggajian dan Tunjangan</h3>
                <table>
                    <tr><td class="label">Gaji Pokok</td><td class="value">Rp ${employee.baseSalary || '-'}</td></tr>
                    <tr><td class="label">Tunjangan Jabatan</td><td class="value">Rp ${employee.positionAllowance || '-'}</td></tr>
                    <tr><td class="label">Tunj. Makan/Transport</td><td class="value">Rp ${employee.mealAllowance || '-'}</td></tr>
                    <tr><td class="label">Bank & Rekening</td><td class="value">${employee.bankName || '-'} - ${employee.bankAccount || '-'}</td></tr>
                    <tr><td class="label">Potongan PPh 21</td><td class="value">Rp ${employee.taxDeduction || '-'}</td></tr>
                    <tr><td class="label">Potongan BPJS</td><td class="value">Rp ${employee.bpjsDeduction || '-'}</td></tr>
                    <tr><td class="label">Potongan Pinjaman</td><td class="value">Rp ${employee.loanDeduction || '-'}</td></tr>
                </table>

                <h3>4. Data Kehadiran</h3>
                <table>
                    <tr><td class="label">Sisa Cuti Tahunan</td><td class="value">${employee.leaveBalance || '-'} Hari</td></tr>
                    <tr><td class="label">Cuti Sakit</td><td class="value">${employee.sickLeave || '-'} Hari</td></tr>
                    <tr><td class="label">Izin Tidak Masuk</td><td class="value">${employee.unpaidLeave || '-'} Hari</td></tr>
                    <tr><td class="label">Cuti Hamil</td><td class="value">${employee.maternityLeave || '-'} Hari</td></tr>
                </table>

                <h3>5. Data Kinerja & Pengembangan</h3>
                <table>
                    <tr><td class="label">Skor KPI/Evaluasi</td><td class="value">${employee.kpiScore || '-'}</td></tr>
                    <tr><td class="label">Riwayat Karier</td><td class="value">${employee.careerHistory || '-'}</td></tr>
                    <tr><td class="label">Pelatihan/Sertifikasi</td><td class="value">${employee.trainingHistory || '-'}</td></tr>
                </table>

                <h3>6. Data Administrasi Hukum</h3>
                <table>
                    <tr><td class="label">Catatan Disipliner</td><td class="value">${employee.disciplinaryRecords || '-'}</td></tr>
                </table>
                
                <div class="footer">
                    Dicetak secara otomatis dari Sistem HRIS pada: <strong>${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
            </body>
            </html>
        `;

        // Create Blob with BOM for UTF-8 and MS Word MIME type
        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });

        // Create and trigger download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        const fileNameSafe = (employee.fullName || 'Data_Karyawan').replace(/\s+/g, '_');
        downloadLink.download = `Data_Karyawan_${fileNameSafe}.doc`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // Replace the raw inline onclick with our new window function
    setTimeout(() => {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.onclick = function() { window.toggleDetails(this); };
        });
    }, 100);

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        renderHistory(e.target.value);
    });

    // Image Modal Logic
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCloseBtn = document.querySelector('.modal-close');

    window.openImage = function(src) {
        if(src && src.length > 100) { // Don't enlarge default empty avatars heavily
            imageModal.style.display = "block";
            modalImage.src = src;
        }
    }

    modalCloseBtn.onclick = function() {
        imageModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == imageModal) {
            imageModal.style.display = "none";
        }
    }

    function showToast(message) {
        if(message) toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
