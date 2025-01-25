A collaborative web-based drawing tool inspired by Excalidraw. This project allows users to create, save, and share hand-drawn sketches with ease. It is built for simplicity, collaboration, and creative freedom.

Features
🎨 Customizable Canvas: Draw shapes, lines, and text with intuitive controls.
🔄 Real-Time Collaboration: Collaborate with others in real-time on shared sketches.
💾 Save and Load Drawings: Save drawings to the database and load them for future edits.
🌐 User Accounts: Authenticate users with signup and login functionality.
🗂️ Version Control: Maintain version history of drawings for easy restoration.
🔒 Access Control: Manage public and private drawings with role-based permissions.
Tech Stack
Frontend: React.js, TypeScript, Tailwind CSS
Backend: Node.js, Express.js, Web-Sockets 
Database: Postgres SQL
Real-Time Collaboration: WebSockets
Authentication: JSON Web Tokens (JWT)
How to Run Locally
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/excalidraw-clone.git
cd excalidraw-clone
Install dependencies:

bash
Copy
Edit
pnpm install
Configure environment variables in .env:

env
Copy
Edit
DATABASE_URL="your-mongodb-connection-string"
JWT_SECRET="your-secret-key"
Start the development server:

bash
Copy
Edit
pnpm dev
Open the app in your browser at http://localhost:3000.

Roadmap
 Add support for exporting drawings as PNG or SVG.
 Implement advanced shape tools (e.g., arrows, curves).
 Integrate third-party authentication (Google, GitHub).
 Enhance collaboration with live cursors and comments.
