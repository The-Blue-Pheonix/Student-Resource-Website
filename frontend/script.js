document.addEventListener("DOMContentLoaded", function() {

    // --- 1. STAR RATING INPUT LOGIC ---
    
    const stars = document.querySelectorAll(".star-rating-input .star");
    const ratingValueInput = document.getElementById("ratingValue");
    let currentRating = 0;

    stars.forEach(star => {
        // --- Hover effect ---
        star.addEventListener("mouseover", () => {
            resetStars();
            const value = parseInt(star.getAttribute("data-value"));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add("hover");
            }
        });

        star.addEventListener("mouseout", () => {
            resetStars();
            // Re-fill stars up to the current clicked rating
            for (let i = 0; i < currentRating; i++) {
                stars[i].classList.add("filled");
            }
        });

        // --- Click effect ---
        star.addEventListener("click", () => {
            currentRating = parseInt(star.getAttribute("data-value"));
            ratingValueInput.value = currentRating;
            resetStars();
            for (let i = 0; i < currentRating; i++) {
                stars[i].classList.add("filled");
            }
        });
    });

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove("hover", "filled");
        });
    }

    // --- 2. FORM SUBMISSION (Mock) ---
    // This part just logs the data. You would replace this
    // with a 'fetch' call to your backend database.
    const reviewForm = document.getElementById("reviewForm");
    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevents the page from reloading
        
        const rating = ratingValueInput.value;
        const message = document.getElementById("feedbackMessage").value;

        if (rating === "0") {
            alert("Please select a star rating.");
            return;
        }

        console.log("--- Feedback Submitted ---");
        console.log("Rating:", rating);
        console.log("Message:", message);
        
        alert("Thank you for your feedback!");
        
        // Clear the form
        reviewForm.reset();
        currentRating = 0;
        ratingValueInput.value = 0;
        resetStars();
    });


    // --- 3. CAROUSEL LOGIC ---

    const track = document.querySelector(".carousel-track");
    const cards = Array.from(track.children);
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (cards.length > 0) {
        // Get the width of one card (including its margin)
        const cardWidth = cards[0].getBoundingClientRect().width + 20; // 20px for margin (10px left + 10px right)
        
        let currentIndex = 0;

        // Function to move the slide
        function moveToSlide(index) {
            // Check for boundaries
            if (index < 0) {
                index = 0;
            }
            if (index > cards.length - 1) {
                // This logic is for a non-infinite loop.
                // You can adjust if you want it to wrap around.
                index = cards.length - 1; 
            }

            track.style.transform = `translateX(-${cardWidth * index}px)`;
            currentIndex = index;
            updateArrowVisibility();
        }

        // Hide/show arrows at the beginning/end
        function updateArrowVisibility() {
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
            
            // To check if we are at the end, we need to know how many cards fit on screen
            const trackContainerWidth = track.parentElement.getBoundingClientRect().width;
            const visibleCards = Math.floor(trackContainerWidth / cardWidth);
            
            if (currentIndex >= cards.length - visibleCards) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }

        // --- Event Listeners ---
        nextBtn.addEventListener("click", () => {
            moveToSlide(currentIndex + 1);
        });

        prevBtn.addEventListener("click", () => {
            moveToSlide(currentIndex - 1);
        });

        // Initialize
        updateArrowVisibility();
    }
});