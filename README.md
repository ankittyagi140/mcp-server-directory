# MCP Server Directory

A comprehensive directory application for Minecraft Protocol (MCP) servers with search, filtering, and submission capabilities.

## Features

- **Server Listings**: Browse and explore MCP servers with detailed information
- **Search & Filter**: Find servers by tags, features, or keywords
- **Server Detail Page**: View comprehensive information about each server
- **Submission Form**: Submit your own MCP servers to the directory
- **Admin Review**: Moderation system for reviewing server submissions

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.io/) - Backend database and authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling and UI components
- [React Hook Form](https://react-hook-form.com/) - Form validation
- [Zod](https://github.com/colinhacks/zod) - Schema validation
- [Lucide Icons](https://lucide.dev/) - Beautiful SVG icons
- [Next Themes](https://github.com/pacocoursey/next-themes) - Theme switching

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-server-directory.git
   cd mcp-server-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up Supabase:
   Create a `servers` table with the following schema:
   - id (uuid, primary key)
   - created_at (timestamp)
   - name (text)
   - description (text)
   - endpoint_url (text)
   - tags (array)
   - logo_url (text, nullable)
   - github_url (text, nullable)
   - contact_info (text, nullable)
   - status (text, enum: 'pending', 'approved', 'rejected')
   - features (array)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application can be easily deployed on platforms like Vercel:

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- All the contributors to the open-source libraries used in this project
- The Minecraft community for their continuous innovation
