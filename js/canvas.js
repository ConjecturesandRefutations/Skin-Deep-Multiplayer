
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.display = 'none';

// Set canvas dimensions to match screen dimensions
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial call to set canvas size on page load
setCanvasSize();

// Update canvas size when the window is resized
window.addEventListener('resize', setCanvasSize);
