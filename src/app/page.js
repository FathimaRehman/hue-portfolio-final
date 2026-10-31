
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "fathima-portfolio-projects";

const defaultProjects = [
  {
    id: 1,
    title: "Artpha Technical",
    category: "WordPress Development",
    description:
      "A professional business website with customized WordPress layouts, responsive pages, and organized service content.",
    url: "https://artpha-tech.com/",
    number: "01",
    symbol: "✳",
    color: "violet",
  },
  {
    id: 2,
    title: "Arabian Dreamz",
    category: "WordPress Development",
    description:
      "A WordPress website designed around a clean layout, responsive styling, and an accessible browsing experience.",
    url: "https://arabian.pixelprodemo.com/",
    number: "02",
    symbol: "✧",
    color: "blue",
  },
  {
    id: 3,
    title: "Pinakin Interiors",
    category: "Interior Design Website",
    description:
      "A website showcasing interior design services through an elegant visual presentation and structured content.",
    url: "https://pinakininteriors.com/",
    number: "03",
    symbol: "◈",
    color: "pink",
  },
  {
    id: 4,
    title: "Paradise",
    category: "WordPress Development",
    description:
      "A business website developed with WordPress and responsive layouts for desktop and mobile visitors.",
    url: "https://paradise.pixelprodemo.com/",
    number: "04",
    symbol: "◇",
    color: "blue",
  },
  {
    id: 5,
    title: "Thalir Villa",
    category: "Website Development",
    description:
      "A website presenting property information and accommodation details in a user-friendly format.",
    url: "https://thalirvilla.com/",
    number: "05",
    symbol: "⌂",
    color: "violet",
  },
  {
    id: 6,
    title: "Aura Gray",
    category: "WordPress Development",
    description:
      "A modern website with a refined visual style, responsive sections, and structured business content.",
    url: "https://auragray.proxcelerate.com/",
    number: "06",
    symbol: "✦",
    color: "pink",
  },
  {
    id: 7,
    title: "True Green Cargo",
    category: "Business Website",
    description:
      "A business website presenting cargo and logistics services through clear navigation and responsive pages.",
    url: "https://truegreenscargo.com/",
    number: "07",
    symbol: "↗",
    color: "blue",
  },
  {
    id: 8,
    title: "Alfayzn",
    category: "WordPress Development",
    description:
      "A WordPress website with customized page layouts and mobile-friendly styling.",
    url: "https://alfayzn.pixelprosolution.com/",
    number: "08",
    symbol: "✳",
    color: "violet",
  },
  {
    id: 9,
    title: "Disaster Management System",
    category: "MERN Stack Application",
    description:
      "A web application concept for incident reporting, emergency information management, and user administration using React, Node.js, Express, and MongoDB.",
    number: "09",
    symbol: "⌖",
    color: "pink",
  },
  {
    id: 10,
    title: "AI Diet Consultant",
    category: "AI Application",
    description:
      "An application concept for personalized diet plans, recipes, health insights, and progress tracking.",
    number: "10",
    symbol: "✺",
    color: "blue",
  },
  {
    id: 11,
    title: "E-commerce Platform",
    category: "E-commerce Development",
    description:
      "A responsive online shopping application concept with product discovery and a user-friendly shopping experience.",
    number: "11",
    symbol: "◇",
    color: "violet",
  },
];

const skills = [
  "WordPress",
  "Shopify",
  "Theme Customization",
  "Plugin Customization",
  "HTML5",
  "CSS3",
  "JavaScript ES6+",
  "TypeScript",
  "React",
  "Angular",
  "Bootstrap",
  "Responsive Design",
  "Node.js",
  "Express.js",
  "REST APIs",
  "MongoDB",
  "MySQL",
  "SQL",
  "Git",
  "GitHub",
  "VS Code",
  "Visual Studio",
];

const experience = [
  {
    role: "WordPress Developer Intern",
    company: "PixelPro Solution",
    period: "Jul 2026 – Oct 2026",
    location: "Calicut, Kerala",
    description: [
      "Developed and customized WordPress websites according to project requirements.",
      "Customized themes, configured plugins, and built responsive pages.",
      "Updated website content, troubleshot issues, and collaborated with the development team.",
    ],
  },
  {
    role: "Junior Developer",
    company: "RISS Technologies",
    period: "Nov 2024 – Oct 2025",
    location: "India",
    description: [
      "Developed responsive web pages using HTML, CSS, and JavaScript frameworks.",
      "Integrated REST APIs to connect frontend and backend functionality.",
      "Improved website usability, performance, and cross-device compatibility.",
    ],
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [adminProjects, setAdminProjects] = useState([]);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    dateTime: "",
    agenda: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [formStatusType, setFormStatusType] = useState("");
  const [minimumDateTime, setMinimumDateTime] = useState("");

  // Calculate the minimum booking date after the page mounts.
  useEffect(() => {
    const now = new Date();

    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setMinimumDateTime(localDateTime);
  }, []);

  // Load projects created through the admin dashboard.
  useEffect(() => {
    function loadAdminProjects() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);
          setAdminProjects(Array.isArray(parsed) ? parsed : []);
        } else {
          setAdminProjects([]);
        }
      } catch (error) {
        console.error("Unable to load admin projects:", error);
      }
    }

    loadAdminProjects();

    window.addEventListener("storage", loadAdminProjects);
    window.addEventListener("focus", loadAdminProjects);

    return () => {
      window.removeEventListener("storage", loadAdminProjects);
      window.removeEventListener("focus", loadAdminProjects);
    };
  }, []);

  // Close project modal with Escape.
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Combine default projects and projects added by admin.
  const allProjects = [
    ...defaultProjects,
    ...adminProjects.map((project, index) => ({
      ...project,
      number:
        project.number ||
        String(defaultProjects.length + index + 1).padStart(2, "0"),
      symbol: project.symbol || "✳",
      color: project.color || "violet",
    })),
  ];

  function handleBookingChange(event) {
    const { name, value } = event.target;

    setBookingForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormStatus("");
    setFormStatusType("");
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (bookingLoading) return;

    if (
      !bookingForm.fullName.trim() ||
      !bookingForm.email.trim() ||
      !bookingForm.dateTime ||
      !bookingForm.agenda.trim()
    ) {
      setFormStatus("Please complete all required fields.");
      setFormStatusType("error");
      return;
    }

    const selectedDate = new Date(bookingForm.dateTime);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      setFormStatus("Please select a future date and time.");
      setFormStatusType("error");
      return;
    }

    setBookingLoading(true);
    setFormStatus("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: bookingForm.fullName.trim(),
          email: bookingForm.email.trim(),
          dateTime: selectedDate.toISOString(),
          agenda: bookingForm.agenda.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit your meeting request."
        );
      }

      setFormStatus(
        "Your meeting request has been submitted successfully! Please check your email."
      );
      setFormStatusType("success");

      setBookingForm({
        fullName: "",
        email: "",
        dateTime: "",
        agenda: "",
      });
    } catch (error) {
      setFormStatus(
        error.message || "Something went wrong. Please try again."
      );
      setFormStatusType("error");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main>
      {/* NAVIGATION */}
      <nav className="navbar">
        <a href="#home" className="logo" aria-label="Fathima home">
          FR<span>.</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          {[
            ["Home", "#home"],
            ["About", "#about"],
            ["Experience", "#experience"],
            ["Projects", "#projects"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}

          <a
            href="#contact"
            className="nav-cta"
            onClick={() => setMenuOpen(false)}
          >
            Let's Talk <span>↗</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero section-container">
        <div className="hero-content">
          <div className="availability">
            <span className="status-dot" />
            WEB DEVELOPER
          </div>

          <p className="eyebrow">HELLO, I'M</p>

          <h1>
            Fathima
            <br />
            <span>Rehman A.</span>
          </h1>

          <h2>
            WordPress Developer
            <span className="purple-text"> &amp; </span>
            MERN Stack Developer
          </h2>

          <p className="hero-description">
            I create responsive websites, engaging e-commerce
            experiences, and modern web applications with a focus
            on clean design, usability, and performance.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="button-primary">
              Explore My Work <span>↗</span>
            </a>

            <a href="#contact" className="button-secondary">
              Get in Touch
            </a>
          </div>

          <div className="hero-socials">
            <a
              href="https://github.com/FathimaRehman"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>

            <a
              href="https://linkedin.com/in/fathima-rehman-contactme"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>

            <a href="mailto:fathimarehmana@gmail.com">
              Email ↗
            </a>
          </div>

          <div className="hero-location">
            <span>⌖</span> Calicut, Kerala, India
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="profile-card">
            <div className="profile-glow" />

            <img
              src="/fathima.jpeg"
              alt="Fathima Rehman A"
              className="profile-photo"
            />

            <p className="profile-caption">
              CREATIVE MIND. CLEAN CODE.
            </p>
          </div>

          <div className="floating-card floating-top">
            <span className="float-icon">✳</span>
            <div>
              <strong>WordPress</strong>
              <p>Custom websites</p>
            </div>
          </div>

          <div className="floating-card floating-bottom">
            <span className="code-icon">{"</>"}</span>
            <div>
              <strong>MERN Stack</strong>
              <p>Modern web apps</p>
            </div>
          </div>

          <span className="decorative-star star-one">✳</span>
          <span className="decorative-star star-two">✦</span>
        </div>

        <a href="#about" className="scroll-indicator">
          <span /> SCROLL TO EXPLORE
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-container content-section">
        <div className="section-heading">
          <p className="eyebrow">01 — ABOUT ME</p>

          <h2>
            Design meets <span className="purple-text">development.</span>
          </h2>

          <p>
            Building useful digital experiences with creativity,
            technical knowledge, and attention to detail.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-copy glass-card">
            <span className="card-label">MY STORY</span>

            <h3>
              Turning ideas into functional, user-friendly websites.
            </h3>

            <p>
              I'm Fathima Rehman A, a web developer with hands-on
              experience in WordPress, Shopify, e-commerce website
              development, and modern web technologies.
            </p>

            <p>
              I enjoy customizing themes and plugins, creating
              mobile-friendly interfaces, integrating APIs,
              troubleshooting issues, and improving website
              performance.
            </p>

            <p>
              With a Master's degree in Computer Applications,
              I'm continuing to grow my skills in frontend and
              full-stack development while contributing to practical
              web projects.
            </p>

            <div className="education">
              <div className="education-item">
                <span className="education-dot" />

                <div>
                  <strong>
                    Master of Computer Applications (MCA)
                  </strong>
                  <p>University of Calicut · First Class</p>
                </div>
              </div>
            </div>
          </div>

          <div className="skills-card glass-card">
            <span className="card-label">MY TOOLKIT</span>

            <h3>Technologies I work with.</h3>

            <p className="muted-text">
              Technologies and tools used across my web development work.
            </p>

            <div className="skills-list">
              {skills.map((skill) => (
                <span className="skill-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="language-block">
              <span className="card-label">LANGUAGES</span>
              <p>English · Malayalam</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="section-container content-section"
      >
        <div className="section-heading">
          <p className="eyebrow">02 — EXPERIENCE</p>

          <h2>
            My professional <span className="purple-text">journey.</span>
          </h2>

          <p>
            Experience developing responsive websites, customizing
            WordPress, and building web interfaces.
          </p>
        </div>

        <div className="experience-list">
          {experience.map((item, index) => (
            <article
              className="experience-card glass-card"
              key={`${item.company}-${item.role}`}
            >
              <div className="experience-marker">
                <span>0{index + 1}</span>
              </div>

              <div className="experience-main">
                <div className="experience-header">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="experience-company">{item.company}</p>
                  </div>

                  <span className="experience-period">
                    {item.period}
                  </span>
                </div>

                <p className="experience-location">{item.location}</p>

                <ul className="experience-points">
                  {item.description.map((description) => (
                    <li key={description}>{description}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="section-container content-section"
      >
        <div className="section-heading">
          <p className="eyebrow">03 — SELECTED WORK</p>

          <h2>
            Projects I've worked <span className="purple-text">on.</span>
          </h2>

          <p>
            A selection of WordPress websites and web application
            projects from my development journey.
          </p>
        </div>

        <div className="projects-grid">
          {allProjects.map((project, index) => (
            <article
              className="project-card"
              key={project.id ?? `${project.title}-${index}`}
            >
              <button
                type="button"
                className={`project-art project-art-${project.color || "violet"}`}
                onClick={() => setSelectedProject(project)}
                aria-label={`View details for ${project.title}`}
              >
                <span className="project-number">
                  {project.number ||
                    String(index + 1).padStart(2, "0")}
                </span>

                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-preview-image"
                  />
                ) : (
                  <span className="project-art-symbol">
                    {project.symbol || "✳"}
                  </span>
                )}

                <span className="project-open">↗</span>
              </button>

              <div className="project-info">
                <span className="card-label">
                  {project.category || "Web Development"}
                </span>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="project-actions">
                  <button
                    type="button"
                    className="project-link"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details ↗
                  </button>

                  {project.url && (
                    <a
                      className="project-external"
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Website ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="projects-note">
          Project descriptions are summaries. Make sure they accurately
          describe your contribution before publishing.
        </p>
      </section>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project details"
            >
              ✕
            </button>

            {selectedProject.image && (
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="modal-project-image"
              />
            )}

            <p className="eyebrow">
              PROJECT {selectedProject.number || ""}
            </p>

            <h2 id="modal-title">{selectedProject.title}</h2>

            <span className="card-label">
              {selectedProject.category || "Web Development"}
            </span>

            <p className="modal-description">
              {selectedProject.description}
            </p>

            {selectedProject.url && (
              <a
                className="button-primary modal-button"
                href={selectedProject.url}
                target="_blank"
                rel="noreferrer"
              >
                Visit Live Website ↗
              </a>
            )}

            <button
              type="button"
              className="button-secondary modal-button"
              onClick={() => setSelectedProject(null)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* CONTACT AND MEETING BOOKING */}
      <section
        id="contact"
        className="section-container content-section"
      >
        <div className="contact-panel">
          <div className="contact-copy">
            <p className="eyebrow">04 — GET IN TOUCH</p>

            <h2>
              Let's create
              <br />
              <span className="purple-text">something great.</span>
            </h2>

            <p>
              Have a project, a development opportunity, or an idea
              you'd like to discuss? Book a meeting and let's talk.
            </p>

            <div className="contact-detail">
              <span className="contact-icon">@</span>

              <div>
                <span className="card-label">EMAIL</span>
                <a href="mailto:fathimarehmana@gmail.com">
                  fathimarehmana@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-icon">☎</span>

              <div>
                <span className="card-label">PHONE</span>
                <a href="tel:+919961612566">
                  +91 99616 12566
                </a>
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-icon">↗</span>

              <div>
                <span className="card-label">SOCIAL</span>

                <a
                  href="https://linkedin.com/in/fathima-rehman-contactme"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>

                {" · "}

                <a
                  href="https://github.com/FathimaRehman"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* BOOKING FORM */}
          <form
            className="contact-form glass-card"
            onSubmit={handleBookingSubmit}
          >
            <div className="booking-form-heading">
              <span className="card-label">
                SCHEDULE A CONVERSATION
              </span>

              <h3>Request a Meeting</h3>

              <p>
                Fill in the details below to request a meeting.
                I'll get back to you soon.
              </p>
            </div>

            <label htmlFor="booking-name">
              Full Name *
            </label>

            <input
              id="booking-name"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={bookingForm.fullName}
              onChange={handleBookingChange}
              required
            />

            <label htmlFor="booking-email">
              Email Address *
            </label>

            <input
              id="booking-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={bookingForm.email}
              onChange={handleBookingChange}
              required
            />

            <label htmlFor="booking-date">
              Preferred Date and Time *
            </label>

            <input
              id="booking-date"
              name="dateTime"
              type="datetime-local"
              min={minimumDateTime || undefined}
              value={bookingForm.dateTime}
              onChange={handleBookingChange}
              required
            />

            <label htmlFor="booking-agenda">
              Reason for Meeting / Agenda *
            </label>

            <textarea
              id="booking-agenda"
              name="agenda"
              rows={6}
              placeholder="Tell me about the project or topics you would like to discuss..."
              value={bookingForm.agenda}
              onChange={handleBookingChange}
              required
            />

            <button
              type="submit"
              className="button-primary"
              disabled={bookingLoading}
            >
              {bookingLoading
                ? "Submitting..."
                : "Request a Meeting ↗"}
            </button>

            {formStatus && (
              <p
                className={`form-status ${formStatusType}`}
                role="status"
                aria-live="polite"
              >
                {formStatus}
              </p>
            )}

            <p className="booking-privacy">
              Your information will only be used to respond to your
              meeting request.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="logo">
          FR<span>.</span>
        </a>

        <p>Designed &amp; built by Fathima Rehman A.</p>

        <a href="#home">Back to top ↑</a>
      </footer>
    </main>
  );
}
