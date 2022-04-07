# Fullstack Coding Challenge

Small project to discover new GitHub projects.

- Run ```docker-compose up```
- **Frontend runs on port 8080**
- API listens on port 3000

## API routes

### ```GET /repositories```
Lists all repos, created in the last week, sorted by stars descending.

Can be paginated with query strings "page" and "itemsPerPage"

### ```GET /repositories/:owner/:repo```
Returns information about a specific repository

### ```GET /user/starred```
Returns a list of repository ids, marked by the user

### ```PUT /user/starred/:owner/:repo```
Marks a repository

### ```DELETE /user/starred/:owner/:repo```
Unmarks a repository 
