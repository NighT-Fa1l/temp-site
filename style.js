// Select the SVG element
const svgElement = document.getElementById('animated-svg');
const path = svgElement.querySelector('path');

// Get the total length of the path (used for stroke-dasharray and stroke-dashoffset)
const pathLength = path.getTotalLength();

// Set initial stroke-dasharray and stroke-dashoffset based on the path's length
path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength - 160;  // Keep the first 160px visible

// Variable to track the last scroll position
let lastScrollPosition = 0;

// Speed multiplier (adjust this value to make it faster or slower)
const speedMultiplier = 2;

// Listen for the scroll event
window.addEventListener('scroll', () => {
    // Get the scroll position and the window height
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Calculate the scroll progress as a value between 0 and 1
    const scrollProgress = scrollPosition / (documentHeight - windowHeight);

    // Apply the speed multiplier to make the animation faster
    const drawAmount = pathLength * scrollProgress * speedMultiplier;

    // Adjust dashoffset (drawing/erasing path) based on scroll direction
    if (scrollPosition > lastScrollPosition) {
        // Scrolling down, draw more
        path.style.strokeDashoffset = pathLength - drawAmount - 160;  // Adjust to keep first 160px visible
    } else {
        // Scrolling up, erase more
        path.style.strokeDashoffset = pathLength - drawAmount - 160;  // Same adjustment for erasing
    }

    // Update last scroll position for future comparison
    lastScrollPosition = scrollPosition;
});
