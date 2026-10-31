
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "fathima-portfolio-projects";

const DEFAULT_PROJECTS = [
    {
        id: 1,
        title: "Blue Desert",
        category: "WordPress Development",
        description: "A professional website showcasing the brand, its services, and business information.",
        url: "https://bluedesert.pixelprosolution.com/",
    },
    {
        id: 2,
        title: "Artpha Technical",
        category: "WordPress Development",
        description: "A business website presenting technical services through a clean, professional design.",
        url: "https://artpha-tech.com/",
    },
    {
        id: 3,
        title: "Arabian Dreamz",
        category: "WordPress Development",
        description: "A travel website showcasing destinations, tour packages, and travel services.",
        url: "https://arabian.pixelprodemo.com/",
    },
    {
        id: 4,
        title: "Pinakin Interiors",
        category: "WordPress Development",
        description: "An interior design website highlighting design services and interior projects.",
        url: "https://pinakininteriors.com/",
    },
    {
        id: 5,
        title: "Paradise",
        category: "WordPress Development",
        description: "A website designed to showcase the brand, its offerings, and key information.",
        url: "https://paradise.pixelprodemo.com/",
    },
    {
        id: 6,
        title: "Thalir Villa",
        category: "WordPress Development",
        description: "A villa website presenting the property, its features, and accommodation details.",
        url: "https://thalirvilla.com/",
    },
    {
        id: 7,
        title: "Aura Gray",
        category: "WordPress Development",
        description: "A professional business website showcasing the brand and its services.",
        url: "https://auragray.proxcelerate.com/",
    },
    {
        id: 8,
        title: "True Green Cargo",
        category: "WordPress Development",
        description: "A business website presenting cargo and logistics services.",
        url: "https://truegreenscargo.com/",
    },
    {
        id: 9,
        title: "Alfayzn",
        category: "WordPress Development",
        description: "A business website highlighting the brand and its services.",
        url: "https://alfayzn.pixelprosolution.com/",
    },
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState(DEFAULT_PROJECTS);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        try {
            const savedProjects = localStorage.getItem(STORAGE_KEY);

            if (savedProjects) {
                const parsedProjects = JSON.parse(savedProjects);
                if (Array.isArray(parsedProjects)) {
                    setProjects(parsedProjects);
                }
            }
        } catch (error) {
            console.error("Could not load saved projects:", error);
        }

        const handleStorageChange = (event) => {
            if (event.key === STORAGE_KEY && event.newValue) {
                try {
                    const updatedProjects = JSON.parse(event.newValue);
                    if (Array.isArray(updatedProjects)) {
                        setProjects(updatedProjects);
                    }
                } catch (error) {
                    console.error("Could not update projects:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const categories = [
        "All",
        ...new Set(projects.map((project) => project.category)),
    ];

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            activeCategory === "All" || project.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <main className="projects-page">
            <section className="projects-header">
                <span className="projects-subtitle">MY PORTFOLIO</span>

                <h1>
                    My <span>Projects</span>
                </h1>

                <p>
                    Explore a selection of websites and digital experiences I have
                    developed using WordPress and modern web technologies.
                </p>
            </section>

            <input
                className="projects-search"
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <div className="projects-filters">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={activeCategory === category ? "active" : ""}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <section className="projects-grid">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                        <article className="project-card" key={project.id}>
                            <span className="project-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="project-category">
                                {project.category}
                            </span>

                            <h2>{project.title}</h2>

                            <p>{project.description}</p>

                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit Website <span>↗</span>
                            </a>
                        </article>
                    ))
                ) : (
                    <div className="no-projects">
                        No projects found. Try another search.
                    </div>
                )}
            </section>
        </main>
    );
}
