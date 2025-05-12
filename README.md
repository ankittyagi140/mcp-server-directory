# MCP Server Directory - Your Ultimate Model Context Protocol Server & clients Discovery Platform

A comprehensive, user-friendly directory application for discovering, exploring, and managing Model Context Protocol (MCP) servers. Our platform offers powerful search capabilities, advanced filtering options, and seamless server submission features to connect the MCP community.

## Key Features

### 🎮 Server Discovery & Management
- **Comprehensive Server Listings**: Browse through an extensive collection of MCP servers with detailed specifications and performance metrics
- **Advanced Search & Filtering**: Find your perfect server using our intelligent search system that filters by:
  - Server tags and categories
  - Performance metrics
  - Feature availability
  - Custom keywords
- **Detailed Server Profiles**: Access in-depth information about each server including:
  - Technical specifications
  - Performance statistics
  - User reviews and ratings
  - Server status and uptime

### 📝 User-Friendly Submission System
- **Streamlined Server Submission**: Easily add your MCP server to our directory with our intuitive submission form
- **Real-time Validation**: Instant feedback on submission requirements and server compatibility
- **Admin Review System**: Professional moderation ensures quality and reliability of listed servers

### 🔧 Technical Excellence
- **Modern Tech Stack**: Built with cutting-edge technologies for optimal performance:
  - [Next.js](https://nextjs.org/) - Lightning-fast React framework for superior user experience
  - [Supabase](https://supabase.io/) - Robust backend infrastructure for secure data management
  - [Tailwind CSS](https://tailwindcss.com/) - Modern, responsive design system
  - [React Hook Form](https://react-hook-form.com/) - Efficient form handling and validation
  - [Zod](https://github.com/colinhacks/zod) - Type-safe schema validation
  - [Lucide Icons](https://lucide.dev/) - Beautiful, consistent iconography
  - [Next Themes](https://github.com/pacocoursey/next-themes) - Seamless theme customization

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Quick Installation Guide

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-server-directory.git
   cd mcp-server-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up Supabase database:
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

5. Launch the development server:
   ```bash
   npm run dev
   ```

6. Access the application at [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy your instance effortlessly on Vercel:

```bash
npm run build
```

## Why Choose MCP Server Directory?

- **Community-Driven**: Built by and for the MCP community
- **Performance-Focused**: Optimized for speed and reliability
- **User-Centric Design**: Intuitive interface for both server owners and users
- **Secure & Reliable**: Enterprise-grade security and data protection
- **Scalable Architecture**: Ready to grow with your needs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Community & Support

Join our growing community of MCP enthusiasts and server administrators. Your feedback and contributions help us make the MCP Server Directory better for everyone.

## Acknowledgements

Special thanks to:
- The vibrant MCP community for their continuous innovation
- All contributors to the open-source libraries that power this project
- Our dedicated users and server administrators

---
VISIT: https://www.mcp-server-directory.com/
*Built with ❤️ for the MCP community*
