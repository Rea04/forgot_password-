document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    const modalClose = document.getElementById('modal-close');

    // Function to show the modal
    function showModal(title, message, showConfirm = true, onConfirm = null) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';

        if (showConfirm) {
            modalConfirm.style.display = 'inline-block';
            modalCancel.style.display = 'inline-block';
            modalConfirm.onclick = function() {
                if (onConfirm) onConfirm();
                modal.style.display = 'none';
            };
        } else {
            modalConfirm.style.display = 'none';
            modalCancel.style.display = 'none';
        }

        modalCancel.onclick = function() {
            modal.style.display = 'none';
        };

        modalClose.onclick = function() {
            modal.style.display = 'none';
        };

        // Focus on the confirm button for accessibility
        if (showConfirm) {
            modalConfirm.focus();
        }
    }

    // Back Button
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', function() {
        showModal('Navigate Back', 'Are you sure you want to go back to the dashboard?', true, function() {
            window.location.href = 'student_dash.html';
        });
    });

    // Edit Profile Button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    editProfileBtn.addEventListener('click', function() {
        showModal('Edit Profile', 'This feature is not yet implemented. Would you like to proceed?', true, function() {
            showModal('Coming Soon', 'Profile editing will be available in a future update.', false);
        });
    });
});