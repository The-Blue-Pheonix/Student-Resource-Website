// --- 0. INITIALIZE SUPABASE ---
const SUPABASE_URL = "https://gcwolxptngeququxgtgl.supabase.co";
// 🚨 PASTE YOUR NEW, ROLLED KEY HERE
const SUPABASE_KEY = "sb_publishable_v0cEeyPss01CXNn4pjTcNA_8uxD72Lt"; 

// Use the global 'supabase' object from the CDN to create a new, safe client
// We name it 'supabaseClient' to avoid errors.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('Supabase client initialized');


// --- Wait for the page to load before running scripts ---
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. STAR RATING INPUT LOGIC ---
    // ... (This code is correct, no changes needed) ...
    const stars = document.querySelectorAll(".star-rating-input .star");
    const ratingValueInput = document.getElementById("ratingValue");
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener("mouseover", () => {
            resetStars();
            const value = parseInt(star.getAttribute("data-value"));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add("hover");
            }
        });

        star.addEventListener("mouseout", () => {
            resetStars();
            for (let i = 0; i < currentRating; i++) {
                stars[i].classList.add("filled");
            }
        });

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

    // --- 2. FORM SUBMISSION (Now with Supabase) ---
    const reviewForm = document.getElementById("reviewForm");
    reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const rating = ratingValueInput.value;
        const message = document.getElementById("feedbackMessage").value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (rating === "0") {
            alert("Please select a star rating.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        // --- SUPABASE INSERT ---
        // We now use 'supabaseClient'
        const { data, error } = await supabaseClient
            .from('review') 
            .insert([
                { rate: rating, text: message } 
            ]);

        if (error) {
            console.error('Error submitting feedback:', error.message);
            alert('Sorry, there was an error. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Feedback";
        } else {
            console.log('Feedback submitted:', data);
            alert('Thank you for your feedback!');
            
            reviewForm.reset();
            currentRating = 0;
            ratingValueInput.value = 0;
            resetStars();
            
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Feedback";
        }
    });


    // --- 3. CAROUSEL LOGIC ---
    // ... (This code is correct, no changes needed) ...
    const track = document.querySelector(".carousel-track");
    const cards = Array.from(track.children);
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (cards.length > 0) {
        const cardWidth = cards[0].getBoundingClientRect().width + 20; 
        let currentIndex = 0;

        function moveToSlide(index) {
            if (index < 0) index = 0;
            if (index > cards.length - 1) index = cards.length - 1; 

            track.style.transform = `translateX(-${cardWidth * index}px)`;
            currentIndex = index;
            updateArrowVisibility();
        }

        function updateArrowVisibility() {
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
            
            const trackContainerWidth = track.parentElement.getBoundingClientRect().width;
            const visibleCards = Math.floor(trackContainerWidth / cardWidth);
            
            if (currentIndex >= cards.length - visibleCards) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
            }
        }

        nextBtn.addEventListener("click", () => {
            moveToSlide(currentIndex + 1);
        });

        prevBtn.addEventListener("click", () => {
            moveToSlide(currentIndex - 1);
        });

        updateArrowVisibility();
    }
});