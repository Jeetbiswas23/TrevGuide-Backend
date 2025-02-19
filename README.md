
# TrevGuide Backend API

## Setup
1. Clone the repository
2. Run `npm install`
3. Create `.env` file with required environment variables
4. Run `npm start`

## Environment Variables
- MONGODB_URL
- JWT_SECRET
- PORT (optional)

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Blogs
- GET /api/blogs - Get all blogs
- POST /api/blogs - Create new blog
- GET /api/blogs/:id - Get single blog
- PUT /api/blogs/:id - Update blog
- DELETE /api/blogs/:id - Delete blog
- POST /api/blogs/:id/like - Like/unlike blog
- POST /api/blogs/:id/comments - Add comment
- GET /api/blogs/:id/comments - Get blog comments

## Development