# JSON Tree Visualizer 🚀

A modern, fast, and interactive JSON formatter and tree visualizer built with React, Vite, TypeScript, and Tailwind CSS. This tool is designed to help developers, QA engineers, and data enthusiasts parse, validate, format, and navigate complex JSON payloads with ease.

---

## ✨ Key Features

- **🔍 Syntax Validation & Error Reporting**: Instantly checks JSON validity as you type or format, providing detailed line-by-line syntax error alerts.
- **💅 Beautiful Syntax Formatting**: Pretty-prints messy or minified JSON with customizable 2-space indentation and sleek syntax highlighting.
- **🌳 Interactive Tree View**: Renders complex JSON structures (objects, arrays, nested nodes) into an interactive, collapsible tree hierarchy.
- **⚡ Advanced Search & Filtering**: Highlights search terms across keys and values in real-time, automatically expanding the tree structure to reveal matches.
- **🎨 Modern Aesthetic**: Premium look with harmonious HSL colors, smooth transitions, micro-animations, and full responsiveness (mobile-first layout).
- **🐳 Docker Support**: Comes pre-packaged with a Dockerfile for rapid containerized deployment using Nginx.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **UI Components**: Custom components built with Tailwind & inspired by [shadcn/ui](https://ui.shadcn.com/)

---

## 🚀 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (Version 20 or higher recommended)
- [Docker](https://www.docker.com/) (Optional, for containerized execution)

---

### 💻 Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/marcraf/JsonViewer.git
   cd JsonViewer
   ```

2. **Install Dependencies**:
   Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and visit: `http://localhost:5173` (or the port specified in your console).

---

### 🐳 Running with Docker

You can run the application in a lightweight container served by Nginx:

1. **Build the Docker Image**:
   ```bash
   docker build -t json-viewer .
   ```

2. **Run the Container**:
   ```bash
   docker run -d -p 8080:80 json-viewer
   ```
   Access the web app in your browser at: `http://localhost:8080`

---

## 🧪 Testing

The project uses [Vitest](https://vitest.dev/) for unit and integration testing.

To run the test suite:
```bash
cd frontend
npm run test
```

---

## 📂 Project Structure

```
JsonViewer/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── features/       # Feature-based folder structure
│   │   │   └── json-visualizer/  # Core visualizer logic, styles, & tests
│   │   ├── components/     # Reusable layout & global UI components
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile              # Docker multi-stage build setup
├── .gitignore              # Git ignore file (excludes spec/agent documents)
└── README.md               # Main project documentation (this file)
```

---

## 📝 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.
