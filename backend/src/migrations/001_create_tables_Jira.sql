-- Drop existing types if any
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS issue_type CASCADE;
DROP TYPE IF EXISTS issue_status CASCADE;
DROP TYPE IF EXISTS issue_priority CASCADE;

-- Create ENUMs
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE issue_type AS ENUM ('task', 'bug', 'story');
CREATE TYPE issue_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high');


-- TABLE: users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password_hash VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_avatar_url VARCHAR(500),
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE: projects
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    project_key VARCHAR(10) UNIQUE NOT NULL,
    project_description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE: project_members
CREATE TABLE project_members (
    pm_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);


-- TABLE: issues
CREATE TABLE issues (
    issue_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    issue_key VARCHAR(20) UNIQUE NOT NULL,
    issue_name VARCHAR(500) NOT NULL,
    issue_description TEXT,
    issue_type issue_type NOT NULL DEFAULT 'task',
    issue_status issue_status NOT NULL DEFAULT 'todo',
    issue_priority issue_priority NOT NULL DEFAULT 'medium',
    reporter_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    assignee_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    issue_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issue_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: comments
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    issue_id INTEGER NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment_content TEXT NOT NULL,
    comment_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_issues_project ON issues(project_id);
CREATE INDEX idx_issues_reporter ON issues(reporter_id);
CREATE INDEX idx_issues_assignee ON issues(assignee_id);
CREATE INDEX idx_comments_issue ON comments(issue_id);
CREATE INDEX idx_comments_user ON comments(user_id);