
        // Educational Symbols Particle System
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Educational symbols from various subjects
        const symbols = [
            // Math symbols
            '∑', '∫', '∞', '√', 'π', '∆', '≈', '≠', '≤', '≥', 'α', 'β', 'θ', '∂', '∇', 'λ',
            // Chemistry symbols
            'H₂O', 'CO₂', 'O₂', 'H⁺', 'OH⁻', 'Na⁺', 'Cl⁻', '⇌', '→', 'Δ', 'e⁻',
            // Physics symbols
            'E=mc²', 'F=ma', 'ℏ', 'Ω', 'μ', 'ν', 'σ', 'ε', 'φ', 'ψ', 'γ', '℃',
            // Biology/General
            'DNA', 'RNA', '⚛', '🧬', 'ATP', 'pH'
        ];

        class EducationalParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 12 + 10;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.opacity = Math.random() * 0.5 + 0.2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.rotation = Math.random() * Math.PI * 2;
                this.hue = Math.random() * 60 + 260; // Purple to pink range
            }

            update() {
                // Mouse interaction
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const dirX = dx / distance;
                        const dirY = dy / distance;
                        
                        this.x -= dirX * force * 3;
                        this.y -= dirY * force * 3;
                    }
                }

                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Boundary check with wrap-around
                if (this.x < -50) this.x = canvas.width + 50;
                if (this.x > canvas.width + 50) this.x = -50;
                if (this.y < -50) this.y = canvas.height + 50;
                if (this.y > canvas.height + 50) this.y = -50;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.font = `${this.size}px Arial`;
                ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
                
                ctx.restore();
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 20000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new EducationalParticle());
            }
        }

        // Connect particles
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.2;
                        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animate);
        }

        // Mouse move event
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        // Mouse leave event
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize event
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // Typing Animation
        const typingText = document.getElementById('typingText');
        const fullText = "it was just waiting to understand people again.";
        let charIndex = 0;

        function typeText() {
            if (charIndex < fullText.length) {
                typingText.textContent = fullText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeText, 50);
            } else {
                // Add cursor after typing is complete
                typingText.innerHTML += '<span class="typing-cursor"></span>';
            }
        }

        // Start animations after page load
        window.addEventListener('load', () => {
            initParticles();
            animate();
            setTimeout(typeText, 1000); // Start typing after 1 second
        });
   

        //Section 2 Start here

 // Typing Animation
        const typingTitle = document.getElementById('typingTitle');
        //const fullText = "But no one really sees what's happening in between.";
        //let charIndex = 0;
        let typingStarted = false;

        function typeText() {
            if (charIndex < fullText.length) {
                typingTitle.textContent = fullText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeText, 50);
            } else {
                // Add cursor after typing is complete
                typingTitle.innerHTML += '<span class="typing-cursor"></span>';
            }
        }

        // Scroll Animation Observer
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Start typing animation when section title is visible
                    if (entry.target.classList.contains('section-title') && !typingStarted) {
                        typingStarted = true;
                        setTimeout(typeText, 800);
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.addEventListener('DOMContentLoaded', () => {
            const sectionTitle = document.querySelector('.section-title');
            const cards = document.querySelectorAll('.stakeholder-card');
            const conclusionText = document.querySelector('.conclusion-text');
            const ctaButton = document.querySelector('.cta-button');

            observer.observe(sectionTitle);
            cards.forEach(card => observer.observe(card));
            observer.observe(conclusionText);
            observer.observe(ctaButton);

            // Add 3D tilt effect on mouse move
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.05)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
                });
            });
        });

        //Section @ ends here