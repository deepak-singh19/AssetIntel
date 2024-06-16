Draft.js Custom Editor
A rich text editor built using React and Draft.js with custom block and inline styles, along with local storage persistence for editor content and title.

Features
- Rich Text Formatting: Supports bold, underline, and custom red-line styles.
- Custom Block Types: Includes header and code block types.
- Markdown-like Shortcuts: Apply styles using markdown-like syntax (e.g., # for headers, * for bold, etc.).
- Persistent Storage: Saves editor content and title to local storage.

Getting Started
Prerequisites
- Node.js (version 14 or later recommended)
- npm (version 6 or later)

Installation
Clone the repository:
- git clone https://github.com/yourusername/draftjs-custom-editor.git
- cd draftjs-custom-editor

Install dependencies:
- npm install

Run the development server:
- npm start

Usage
> Typing: Start typing in the editor. Use the title input at the top to give your document a title.
> Markdown-like Shortcuts:
- # followed by a space to create a header.
- * followed by a space for bold text.
- ** followed by a space for red-line styled text.
- *** followed by a space for underlined text.
- ``` ` followed by a space for code blocks.
- Saving: Click the "Save" button to store the title and content in local storage.