
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "fathima-portfolio-projects";

const INITIAL_PROJECTS = [
    {
        id: 1,
        title: "Artpha Technical",
        category: "WordPress Development",
        description: "A professional business website with responsive layouts and service pages.",
        url: "https://artpha-tech.com/",
    },
    {
        id: 2,
        title: "Arabian Dreamz",
        category: "WordPress Development",
        description: "A travel website showcasing tour packages and travel services.",
        url: "#",
    },
    {
        id: 3,
        title: "Disaster Management System",
        category: "MERN Stack",
        description: "A web application for managing disaster-related information and user reports.",
        url: "#",
    },
];

const EMPTY_FORM = {
    title: "",
    category: "",
    description: "",
    url: "",
};

export default function AdminPage() {
    // Login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // Dashboard state
    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    // Load saved projects from browser storage
    useEffect(() => {
        try {
            const savedProjects = localStorage.getItem(STORAGE_KEY);

            if (savedProjects !== null) {
                const parsedProjects = JSON.parse(savedProjects);

                if (Array.isArray(parsedProjects)) {
                    setProjects(parsedProjects);
                }
            }
        } catch (error) {
            console.error("Could not load projects:", error);
        }

        setIsLoaded(true);
    }, []);

    // Save projects whenever they change
    useEffect(() => {
        if (!isLoaded) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        } catch (error) {
            console.error("Could not save projects:", error);
            setMessage("Unable to save projects in this browser.");
        }
    }, [projects, isLoaded]);

    // Login handler
    const handleLogin = (event) => {
        event.preventDefault();

        const correctEmail = "admin@fathima.com";
        const correctPassword = "Portfolio@123";

        if (
            email.trim().toLowerCase() === correctEmail &&
            password === correctPassword
        ) {
            setLoginError("");
            setIsLoggedIn(true);
            setPassword("");
        } else {
            setLoginError("Incorrect email or password. Please try again.");
        }
    };

    // Logout handler
    const handleLogout = () => {
        setIsLoggedIn(false);
        setEmail("");
        setPassword("");
        setLoginError("");
        setSearch("");
        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    // Update form fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    // Add or update a project
    const handleSaveProject = (event) => {
        event.preventDefault();

        if (!form.title.trim() || !form.category.trim()) {
            setMessage("Please enter the project title and category.");
            return;
        }

        if (editingId !== null) {
            setProjects((previousProjects) =>
                previousProjects.map((project) =>
                    project.id === editingId
                        ? { ...project, ...form }
                        : project
                )
            );

            setMessage("Project updated successfully.");
        } else {
            const newProject = {
                id: Date.now(),
                ...form,
            };

            setProjects((previousProjects) => [
                newProject,
                ...previousProjects,
            ]);

            setMessage("Project added successfully.");
        }

        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    // Edit project
    const handleEdit = (project) => {
        setForm({
            title: project.title || "",
            category: project.category || "",
            description: project.description || "",
            url: project.url || "",
        });

        setEditingId(project.id);
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Delete project
    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        setProjects((previousProjects) =>
            previousProjects.filter((project) => project.id !== id)
        );

        if (editingId === id) {
            setForm(EMPTY_FORM);
            setEditingId(null);
        }

        setMessage("Project deleted successfully.");
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setMessage("");
    };

    // Search projects
    const filteredProjects = projects.filter((project) => {
        const searchText = search.toLowerCase();

        return (
            (project.title || "").toLowerCase().includes(searchText) ||
            (project.category || "").toLowerCase().includes(searchText) ||
            (project.description || "").toLowerCase().includes(searchText)
        );
    });

    // LOGIN SCREEN
    if (!isLoggedIn) {
        return (
            <main style={styles.loginPage}>
                <div style={styles.loginCard}>
                    <Link href="/" style={styles.backLink}>
                        ← Back to portfolio
                    </Link>

                    <div style={styles.logo}>FR.</div>

                    <p style={styles.eyebrow}>ADMINISTRATION</p>
                    <h1 style={styles.loginTitle}>Welcome back</h1>
                    <p style={styles.loginSubtitle}>
                        Sign in to manage your portfolio projects.
                    </p>

                    <form onSubmit={handleLogin} style={styles.loginForm}>
                        <label style={styles.label} htmlFor="admin-email">
                            Email address
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            autoComplete="username"
                            required
                            style={styles.input}
                        />

                        <label style={styles.label} htmlFor="admin-password">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            style={styles.input}
                        />

                        {loginError && (
                            <p role="alert" style={styles.error}>
                                {loginError}
                            </p>
                        )}

                        <button type="submit" style={styles.primaryButton}>
                            Login to Dashboard →
                        </button>
                    </form>

                    <p style={styles.loginFooter}>
                        Portfolio Admin Panel
                    </p>
                </div>
            </main>
        );
    }

    // DASHBOARD SCREEN
    return (
        <main style={styles.dashboardPage}>
            <aside style={styles.sidebar}>
                <Link href="/" style={styles.sidebarLogo}>
                    FR<span style={{ color: "#a78bfa" }}>.</span>
                </Link>

                <p style={styles.sidebarLabel}>MENU</p>

                <div style={styles.activeMenu}>
                    <span>▦</span> Dashboard
                </div>

                <Link href="/projects" style={styles.sidebarLink}>
                    <span>▣</span> View Projects
                </Link>

                <div style={styles.sidebarBottom}>
                    <p style={styles.adminName}>Fathima Rehman</p>
                    <p style={styles.adminRole}>Administrator</p>

                    <button onClick={handleLogout} style={styles.logoutButton}>
                        ↪ Logout
                    </button>
                </div>
            </aside>

            <section style={styles.mainContent}>
                <header style={styles.topbar}>
                    <div>
                        <p style={styles.eyebrow}>OVERVIEW</p>
                        <h1 style={styles.dashboardTitle}>Admin Dashboard</h1>
                    </div>

                    <Link href="/" style={styles.viewSiteButton}>
                        View Website ↗
                    </Link>
                </header>

                <section style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>TOTAL PROJECTS</p>
                        <h2 style={styles.statNumber}>{projects.length}</h2>
                        <p style={styles.statDescription}>Projects in your portfolio</p>
                    </div>

                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>SEARCH RESULTS</p>
                        <h2 style={styles.statNumber}>{filteredProjects.length}</h2>
                        <p style={styles.statDescription}>Projects matching your search</p>
                    </div>
                </section>

                <section style={styles.contentGrid}>
                    <div style={styles.panel}>
                        <div style={styles.panelHeader}>
                            <div>
                                <p style={styles.eyebrow}>
                                    {editingId !== null ? "EDIT PROJECT" : "NEW PROJECT"}
                                </p>

                                <h2 style={styles.panelTitle}>
                                    {editingId !== null ? "Update project" : "Add a project"}
                                </h2>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProject} style={styles.projectForm}>
                            <label style={styles.label} htmlFor="project-title">
                                Project title *
                            </label>

                            <input
                                id="project-title"
                                name="title"
                                value={form.title}
                                onChange={handleInputChange}
                                placeholder="Enter project name"
                                required
                                style={styles.input}
                            />

                            <label style={styles.label} htmlFor="project-category">
                                Category *
                            </label>

                            <input
                                id="project-category"
                                name="category"
                                value={form.category}
                                onChange={handleInputChange}
                                placeholder="e.g. WordPress Development"
                                required
                                style={styles.input}
                            />

                            <label style={styles.label} htmlFor="project-description">
                                Description
                            </label>

                            <textarea
                                id="project-description"
                                name="description"
                                value={form.description}
                                onChange={handleInputChange}
                                placeholder="Describe your project"
                                rows={4}
                                style={styles.textarea}
                            />

                            <label style={styles.label} htmlFor="project-url">
                                Project URL
                            </label>

                            <input
                                id="project-url"
                                name="url"
                                type="url"
                                value={form.url}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                                style={styles.input}
                            />

                            <button type="submit" style={styles.primaryButton}>
                                {editingId !== null ? "Save Changes" : "+ Add Project"}
                            </button>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    style={styles.cancelButton}
                                >
                                    Cancel Editing
                                </button>
                            )}

                            {message && (
                                <p role="status" style={styles.successMessage}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>

                    <div style={styles.panel}>
                        <div style={styles.panelHeader}>
                            <div>
                                <p style={styles.eyebrow}>PORTFOLIO CONTENT</p>
                                <h2 style={styles.panelTitle}>Manage Projects</h2>
                            </div>
                        </div>

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search projects..."
                            style={styles.searchInput}
                        />

                        <div style={styles.projectList}>
                            {filteredProjects.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>No projects found.</p>
                                    <span>Try another search or add a new project.</span>
                                </div>
                            ) : (
                                filteredProjects.map((project) => (
                                    <article key={project.id} style={styles.projectCard}>
                                        <div style={styles.projectInfo}>
                                            <h3 style={styles.projectTitle}>{project.title}</h3>
                                            <span style={styles.categoryTag}>
                                                {project.category}
                                            </span>
                                            <p style={styles.projectDescription}>
                                                {project.description}
                                            </p>

                                            {project.url && project.url !== "#" && (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={styles.projectUrl}
                                                >
                                                    Visit project ↗
                                                </a>
                                            )}
                                        </div>

                                        <div style={styles.actionButtons}>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(project)}
                                                style={styles.editButton}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(project.id)}
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}

const styles = {
    loginPage: {
        minHeight: "100vh",
        background: "#090812",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
    },
    loginCard: {
        width: "100%",
        maxWidth: "430px",
        padding: "42px",
        background: "#151321",
        border: "1px solid #302942",
        borderRadius: "20px",
        boxShadow: "0 25px 80px rgba(0,0,0,.4)",
    },
    backLink: {
        color: "#aaa3bd",
        textDecoration: "none",
        fontSize: "13px",
    },
    logo: {
        width: "48px",
        height: "48px",
        display: "grid",
        placeItems: "center",
        background: "#7c3aed",
        borderRadius: "13px",
        fontSize: "20px",
        fontWeight: "bold",
        marginTop: "35px",
    },
    eyebrow: {
        color: "#a78bfa",
        fontSize: "11px",
        fontWeight: "bold",
        letterSpacing: "2px",
        margin: "25px 0 10px",
    },
    loginTitle: {
        fontSize: "32px",
        margin: "0 0 10px",
    },
    loginSubtitle: {
        color: "#aaa3bd",
        fontSize: "14px",
        lineHeight: 1.6,
        marginBottom: "30px",
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    label: {
        color: "#d7d1e5",
        fontSize: "13px",
        fontWeight: "600",
        marginTop: "8px",
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px",
        borderRadius: "9px",
        border: "1px solid #39334b",
        background: "#0e0c18",
        color: "#fff",
        fontSize: "14px",
        outline: "none",
    },
    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px",
        borderRadius: "9px",
        border: "1px solid #39334b",
        background: "#0e0c18",
        color: "#fff",
        fontSize: "14px",
        resize: "vertical",
        fontFamily: "Arial, sans-serif",
    },
    primaryButton: {
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: "9px",
        background: "linear-gradient(120deg, #7c3aed, #9b5cf6)",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        marginTop: "12px",
    },
    error: {
        color: "#ff8585",
        fontSize: "13px",
        margin: "3px 0",
    },
    loginFooter: {
        color: "#777087",
        fontSize: "12px",
        textAlign: "center",
        marginTop: "30px",
    },
    dashboardPage: {
        minHeight: "100vh",
        display: "flex",
        background: "#0c0a14",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
    },
    sidebar: {
        width: "235px",
        flexShrink: 0,
        background: "#14111f",
        borderRight: "1px solid #282337",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
    },
    sidebarLogo: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "55px",
    },
    sidebarLabel: {
        color: "#777087",
        fontSize: "10px",
        letterSpacing: "2px",
        fontWeight: "bold",
        marginBottom: "15px",
    },
    activeMenu: {
        background: "#302044",
        color: "#c4a5fd",
        padding: "14px",
        borderRadius: "9px",
        fontSize: "14px",
        marginBottom: "10px",
    },
    sidebarLink: {
        color: "#aaa3bd",
        textDecoration: "none",
        padding: "14px",
        fontSize: "14px",
    },
    sidebarBottom: {
        marginTop: "auto",
        borderTop: "1px solid #302942",
        paddingTop: "20px",
    },
    adminName: {
        fontSize: "14px",
        fontWeight: "bold",
        margin: "0 0 5px",
    },
    adminRole: {
        color: "#918aa3",
        fontSize: "12px",
        margin: "0 0 20px",
    },
    logoutButton: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #493044",
        color: "#ff9999",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
    },
    mainContent: {
        flex: 1,
        minWidth: 0,
        padding: "35px",
    },
    topbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "30px",
    },
    dashboardTitle: {
        fontSize: "29px",
        margin: "0",
    },
    viewSiteButton: {
        color: "#c4a5fd",
        border: "1px solid #49376a",
        padding: "12px 16px",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "13px",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "18px",
        marginBottom: "25px",
    },
    statCard: {
        background: "#171422",
        border: "1px solid #302942",
        borderRadius: "13px",
        padding: "22px",
    },
    statLabel: {
        color: "#9991aa",
        fontSize: "10px",
        letterSpacing: "1.5px",
        fontWeight: "bold",
    },
    statNumber: {
        fontSize: "34px",
        margin: "12px 0",
    },
    statDescription: {
        color: "#918aa3",
        fontSize: "12px",
    },
    contentGrid: {
        display: "grid",
        gridTemplateColumns: "minmax(260px, .85fr) minmax(300px, 1.15fr)",
        gap: "20px",
        alignItems: "start",
    },
    panel: {
        background: "#171422",
        border: "1px solid #302942",
        borderRadius: "13px",
        padding: "23px",
        minWidth: 0,
    },
    panelHeader: {
        marginBottom: "20px",
    },
    panelTitle: {
        fontSize: "20px",
        margin: "0",
    },
    projectForm: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    cancelButton: {
        padding: "12px",
        background: "transparent",
        color: "#c4a5fd",
        border: "1px solid #49376a",
        borderRadius: "8px",
        cursor: "pointer",
    },
    successMessage: {
        color: "#86efac",
        fontSize: "13px",
    },
    searchInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        borderRadius: "8px",
        border: "1px solid #39334b",
        background: "#0e0c18",
        color: "#fff",
        marginBottom: "15px",
        fontSize: "13px",
    },
    projectList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    projectCard: {
        background: "#100e19",
        border: "1px solid #302942",
        borderRadius: "10px",
        padding: "16px",
    },
    projectInfo: {
        minWidth: 0,
    },
    projectTitle: {
        fontSize: "16px",
        margin: "0 0 9px",
    },
    categoryTag: {
        display: "inline-block",
        color: "#c4a5fd",
        background: "#302044",
        borderRadius: "20px",
        padding: "5px 9px",
        fontSize: "10px",
    },
    projectDescription: {
        color: "#aaa3bd",
        fontSize: "12px",
        lineHeight: 1.6,
    },
    projectUrl: {
        color: "#a78bfa",
        fontSize: "12px",
        textDecoration: "none",
    },
    actionButtons: {
        display: "flex",
        gap: "8px",
        marginTop: "14px",
    },
    editButton: {
        background: "#302044",
        border: "1px solid #62458a",
        color: "#d8c4ff",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    deleteButton: {
        background: "#321b27",
        border: "1px solid #693447",
        color: "#ff9ba9",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    emptyState: {
        textAlign: "center",
        padding: "35px 10px",
        color: "#aaa3bd",
        fontSize: "14px",
    },
};
