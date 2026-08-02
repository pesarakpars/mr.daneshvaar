// ======================================================
// MR.DANESHVAAR
// MAIN JAVASCRIPT
// ======================================================

"use strict";


// ======================================================
// PAGE LOAD / LOADER
// ======================================================

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.display = "none";

    }, 1800);

});


// ======================================================
// HEADER SCROLL EFFECT
// ======================================================

const header = document.querySelector("header");

if (header) {

    const updateHeader = () => {

        if (window.scrollY > 80) {

            header.style.background = "rgba(0,0,0,0.95)";

        } else {

            header.style.background = "rgba(0,0,0,0.65)";

        }

    };

    window.addEventListener("scroll", updateHeader);

    updateHeader();

}


// ======================================================
// SCROLL REVEAL ANIMATION
// ======================================================

const revealElements = document.querySelectorAll(
    "section, .service-card, .portfolio-item, .about-content"
);


if ("IntersectionObserver" in window && revealElements.length) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform = "translateY(0)";

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform = "translateY(50px)";

        element.style.transition = "all .8s ease";

        revealObserver.observe(element);

    });

}


// ======================================================
// HERO TITLE TYPING EFFECT
// ======================================================

const heroTitle = document.querySelector(".hero h1");


if (heroTitle) {

    const text = heroTitle.innerText;

    heroTitle.innerText = "";

    let index = 0;


    function typing() {

        if (index < text.length) {

            heroTitle.innerHTML += text.charAt(index);

            index++;

            setTimeout(typing, 70);

        }

    }


    typing();

}


// ======================================================
// ACTIVE NAVIGATION MENU
// ======================================================

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav a");


function updateActiveMenu() {

    let current = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            const id = section.getAttribute("id");

            if (id) {

                current = id;

            }

        }

    });


    navLinks.forEach(link => {

        link.style.color = "white";


        const href = link.getAttribute("href");


        if (
            href &&
            href === "#" + current
        ) {

            link.style.color = "#d4af37";

        }

    });

}


if (navLinks.length) {

    window.addEventListener(
        "scroll",
        updateActiveMenu
    );

    updateActiveMenu();

}


// ======================================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// ======================================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            targetId === "#"
        ) {

            return;

        }


        const target =
            document.querySelector(targetId);


        if (!target) return;


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


// ======================================================
// IMAGE LAZY LOAD
// ======================================================

const images =
    document.querySelectorAll("img");


images.forEach(img => {

    img.loading = "lazy";

});


// ======================================================
// WHATSAPP HEADER BUTTON EFFECT
// ======================================================

const whatsapp =
    document.querySelector(".whatsapp");


if (whatsapp) {

    setInterval(() => {

        whatsapp.style.transform =
            "scale(1.05)";


        setTimeout(() => {

            whatsapp.style.transform =
                "scale(1)";

        }, 500);

    }, 3000);

}


// ======================================================
// PORTFOLIO FILTER
// ======================================================

const filterButtons =
    document.querySelectorAll(
        ".portfolio-filter button"
    );


const portfolioItems =
    document.querySelectorAll(
        ".portfolio-item"
    );


if (filterButtons.length) {

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove("active");

                });


                button.classList.add("active");


                const filter =
                    button.dataset.filter;


                portfolioItems.forEach(item => {

                    if (
                        filter === "all" ||
                        item.dataset.category === filter
                    ) {

                        item.style.display = "block";

                    } else {

                        item.style.display = "none";

                    }

                });

            }
        );

    });

}


// ======================================================
// VIDEO POPUP
// ======================================================

const videoButtons =
    document.querySelectorAll(
        ".play-video"
    );


const modal =
    document.querySelector(
        ".video-modal"
    );


const video =
    document.querySelector(
        ".video-container video"
    );


const closeVideo =
    document.querySelector(
        ".close-video"
    );


/*
    این بخش فقط وقتی اجرا می‌شود
    که Video Modal واقعاً داخل HTML وجود داشته باشد.
*/

if (
    videoButtons.length &&
    modal &&
    video
) {

    videoButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const videoSource =
                    button.dataset.video;


                if (!videoSource) return;


                video.src = videoSource;


                modal.style.display = "flex";


                video.play().catch(() => {});

            }
        );

    });


    if (closeVideo) {

        closeVideo.addEventListener(
            "click",
            closeVideoModal
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeVideoModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.style.display === "flex"
            ) {

                closeVideoModal();

            }

        }
    );


    function closeVideoModal() {

        modal.style.display = "none";

        video.pause();

        video.src = "";

    }

}


// ======================================================
// START PROJECT FORM
// ======================================================

const projectForm =
    document.querySelector(
        "#projectForm"
    );


if (projectForm) {


    const fullName =
        document.querySelector(
            "#fullName"
        );


    const phone =
        document.querySelector(
            "#phone"
        );


    const brand =
        document.querySelector(
            "#brand"
        );


    const description =
        document.querySelector(
            "#description"
        );


    const budget =
        document.querySelector(
            "#budget"
        );


    const startTime =
        document.querySelector(
            "#startTime"
        );


    const instagram =
        document.querySelector(
            "#instagram"
        );


    const website =
        document.querySelector(
            "#website"
        );


    const submitButton =
        document.querySelector(
            "#submitProject"
        );


    const successBox =
        document.querySelector(
            "#projectSuccess"
        );


    // --------------------------------------------------
    // ERROR ELEMENTS
    // --------------------------------------------------

    const fullNameError =
        document.querySelector(
            "#fullNameError"
        );


    const phoneError =
        document.querySelector(
            "#phoneError"
        );


    const descriptionError =
        document.querySelector(
            "#descriptionError"
        );


    // --------------------------------------------------
    // SHOW ERROR
    // --------------------------------------------------

    function showError(
        element,
        message
    ) {

        if (!element) return;

        element.textContent = message;

    }


    // --------------------------------------------------
    // CLEAR ERRORS
    // --------------------------------------------------

    function clearErrors() {

        showError(
            fullNameError,
            ""
        );


        showError(
            phoneError,
            ""
        );


        showError(
            descriptionError,
            ""
        );

    }


    // --------------------------------------------------
    // PHONE NORMALIZATION
    // --------------------------------------------------

    function normalizePhone(value) {

        let result =
            String(value || "")
            .trim()
            .replace(/\s+/g, "")
            .replace(/-/g, "")
            .replace(/\(/g, "")
            .replace(/\)/g, "");


        // تبدیل اعداد فارسی
        result = result
            .replace(/[۰-۹]/g, digit => {

                return "۰۱۲۳۴۵۶۷۸۹"
                    .indexOf(digit);

            });


        // تبدیل اعداد عربی
        result = result
            .replace(/[٠-٩]/g, digit => {

                return "٠١٢٣٤٥٦٧٨٩"
                    .indexOf(digit);

            });


        return result;

    }


    // --------------------------------------------------
    // VALIDATE PHONE
    // --------------------------------------------------

    function isValidIranianPhone(
        value
    ) {

        const normalized =
            normalizePhone(value);


        return /^09\d{9}$/.test(
            normalized
        );

    }


    // --------------------------------------------------
    // GET SELECTED PROJECT TYPES
    // --------------------------------------------------

    function getProjectTypes() {

        const checked =
            projectForm.querySelectorAll(
                'input[name="projectType"]:checked'
            );


        return Array.from(checked)
            .map(item => item.value);

    }


    // --------------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------------

    function validateForm() {

        clearErrors();


        let valid = true;


        const nameValue =
            fullName
                ? fullName.value.trim()
                : "";


        const phoneValue =
            phone
                ? normalizePhone(
                    phone.value
                )
                : "";


        const descriptionValue =
            description
                ? description.value.trim()
                : "";


        if (
            nameValue.length < 2
        ) {

            showError(
                fullNameError,
                "لطفاً نام و نام خانوادگی را وارد کنید."
            );

            valid = false;

        }


        if (
            !isValidIranianPhone(
                phoneValue
            )
        ) {

            showError(
                phoneError,
                "شماره موبایل را به صورت 09xxxxxxxxx وارد کنید."
            );

            valid = false;

        }


        if (
            descriptionValue.length < 5
        ) {

            showError(
                descriptionError,
                "لطفاً کمی درباره پروژه توضیح دهید."
            );

            valid = false;

        }


        return valid;

    }


// --------------------------------------------------
// BUILD PROJECT DATA
// --------------------------------------------------

function buildProjectData() {

    const name =
        fullName
            ? fullName.value.trim()
            : "";

    const phoneNumber =
        phone
            ? normalizePhone(phone.value)
            : "";

    const brandName =
        brand
            ? brand.value.trim()
            : "";

    const projectTypes =
        getProjectTypes();

    const projectDescription =
        description
            ? description.value.trim()
            : "";

    const budgetValue =
        budget
            ? budget.value
            : "";

    const startValue =
        startTime
            ? startTime.value
            : "";

    const instagramValue =
        instagram
            ? instagram.value.trim()
            : "";

    const websiteValue =
        website
            ? website.value.trim()
            : "";

    return {
        full_name: name,
        phone: phoneNumber,
        brand: brandName,
        project_type: projectTypes.join("، "),
        description: projectDescription,
        budget: budgetValue,
        start_time: startValue,
        instagram: instagramValue,
        website: websiteValue
    };
}


// --------------------------------------------------
// FORM SUBMIT → CLOUDFLARE D1
// --------------------------------------------------

projectForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const isValid =
            validateForm();

        if (!isValid) {
            return;
        }

        if (submitButton) {

            submitButton.classList.add("loading");

            submitButton.disabled = true;

        }

        if (successBox) {

            successBox.classList.remove("active");

            successBox.setAttribute(
                "aria-hidden",
                "true"
            );

        }

        try {

            const projectData =
                buildProjectData();


            const response =
                await fetch(
                    "/api/projects",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                projectData
                            )
                    }
                );


            let result = null;

            try {

                result =
                    await response.json();

            } catch (error) {

                result = null;

            }


            if (
                !response.ok ||
                !result ||
                !result.success
            ) {

                throw new Error(
                    result?.message ||
                    "ثبت درخواست انجام نشد."
                );

            }


            if (successBox) {

                successBox.textContent =
                    "درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.";

                successBox.classList.add("active");

                successBox.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }


            projectForm.reset();


        } catch (error) {

            console.error(
                "PROJECT_FORM_ERROR:",
                error
            );


            if (successBox) {

                successBox.textContent =
                    "متأسفانه ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.";

                successBox.classList.add("active");

                successBox.setAttribute(
                    "aria-hidden",
                    "false"
                );

            } else {

                alert(
                    "متأسفانه ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید."
                );

            }

        } finally {

            if (submitButton) {

                submitButton.classList.remove("loading");

                submitButton.disabled = false;

            }

        }

    }
);
    // --------------------------------------------------
    // CLEAR ERROR WHILE TYPING
    // --------------------------------------------------

    if (fullName) {

        fullName.addEventListener(
            "input",
            () => {

                showError(
                    fullNameError,
                    ""
                );

            }
        );

    }


    if (phone) {

        phone.addEventListener(
            "input",
            () => {

                showError(
                    phoneError,
                    ""
                );

            }
        );

    }


    if (description) {

        description.addEventListener(
            "input",
            () => {

                showError(
                    descriptionError,
                    ""
                );

            }
        );

    }

}


// ======================================================
// FLOATING WHATSAPP
// ======================================================

const floatingWhatsApp =
    document.querySelector(
        ".floating-whatsapp"
    );


if (floatingWhatsApp) {

    floatingWhatsApp.addEventListener(
        "click",
        () => {

            /*
                لینک اصلی در HTML قرار دارد.
                این بخش فقط برای اطمینان از باز شدن
                صحیح لینک در موبایل و دسکتاپ است.
            */

        }
    );

}


// ======================================================
// END
// ======================================================
