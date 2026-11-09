document.addEventListener("DOMContentLoaded", () => {
    // Animaciones al hacer scroll (Fade-in)
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // Lógica del Modal (Popup de Captación)
    const modal = document.getElementById("lead-modal");
    const openBtns = document.querySelectorAll(".open-modal");
    const closeBtn = document.querySelector(".close-btn");
    const form = document.getElementById("lead-form");
    const formContainer = document.getElementById("form-container");
    const successMessage = document.getElementById("success-message");

    // URL de Make o Zapier (Reemplaza por la tuya cuando la tengas)
    const WEBHOOK_URL = "https://hook.eu1.make.com/tu-identificador-unico";

    // Abrir modal
    openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.classList.add("show");
            document.body.style.overflow = "hidden"; // Bloquea el scroll del fondo
        });
    });

    // Cerrar modal
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    });

    // Cerrar al hacer clic fuera del modal
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });

    // Enviar formulario sin recargar la página (Conexión con tu Base de Datos)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Conectando...";
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            volume: document.getElementById("volume").value,
            source: "Web and Social - Nueva Marca"
        };

        // Simulación de envío o envío real a Webhook
        fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Mostrar éxito
            formContainer.style.display = "none";
            successMessage.style.display = "block";
            
            // Cerrar y resetear después de 4 segundos
            setTimeout(() => {
                modal.classList.remove("show");
                document.body.style.overflow = "auto";
                form.reset();
                formContainer.style.display = "block";
                successMessage.style.display = "none";
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 4000);
        })
        .catch(error => {
            console.error("Error al enviar:", error);
            // Fallback por si no tienes el Webhook puesto todavía
            formContainer.style.display = "none";
            successMessage.style.display = "block";
            setTimeout(() => {
                modal.classList.remove("show");
                document.body.style.overflow = "auto";
                form.reset();
                formContainer.style.display = "block";
                successMessage.style.display = "none";
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 4000);
        });
    });
});