-- Create Users table
CREATE TABLE Users (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(50) NOT NULL,
    lastName NVARCHAR(50) NOT NULL,
    roles NVARCHAR(MAX) NOT NULL, -- Stored as JSON array
    siteId NVARCHAR(50) NOT NULL,
    departmentId NVARCHAR(50) NOT NULL,
    isActive BIT DEFAULT 1,
    lastLogin DATETIME,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Sites table
CREATE TABLE Sites (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    code NVARCHAR(50) NOT NULL UNIQUE,
    address NVARCHAR(255),
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Departments table
CREATE TABLE Departments (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    code NVARCHAR(50) NOT NULL UNIQUE,
    siteId UNIQUEIDENTIFIER NOT NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (siteId) REFERENCES Sites(id)
);

-- Create Roles table
CREATE TABLE Roles (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255),
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Permissions table
CREATE TABLE Permissions (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255),
    module NVARCHAR(50) NOT NULL,
    action NVARCHAR(50) NOT NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create RolePermissions junction table
CREATE TABLE RolePermissions (
    roleId UNIQUEIDENTIFIER NOT NULL,
    permissionId UNIQUEIDENTIFIER NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (roleId, permissionId),
    FOREIGN KEY (roleId) REFERENCES Roles(id),
    FOREIGN KEY (permissionId) REFERENCES Permissions(id)
);

-- Create UserPermissions junction table for custom permissions
CREATE TABLE UserPermissions (
    userId UNIQUEIDENTIFIER NOT NULL,
    permissionId UNIQUEIDENTIFIER NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (userId, permissionId),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (permissionId) REFERENCES Permissions(id)
);

-- Create indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_users_siteid ON Users(siteId);
CREATE INDEX idx_departments_siteid ON Departments(siteId);
CREATE INDEX idx_permissions_module ON Permissions(module);

-- Insert default admin role and permissions
INSERT INTO Roles (name, description) 
VALUES ('ADMIN', 'System Administrator with full access');

-- Insert basic permissions
INSERT INTO Permissions (name, description, module, action)
VALUES 
    ('USER_CREATE', 'Create new users', 'USER', 'CREATE'),
    ('USER_READ', 'View user details', 'USER', 'READ'),
    ('USER_UPDATE', 'Update user details', 'USER', 'UPDATE'),
    ('USER_DELETE', 'Delete users', 'USER', 'DELETE'),
    ('ROLE_MANAGE', 'Manage roles and permissions', 'ROLE', 'MANAGE'),
    ('SITE_MANAGE', 'Manage sites', 'SITE', 'MANAGE'),
    ('DEPARTMENT_MANAGE', 'Manage departments', 'DEPARTMENT', 'MANAGE');

-- Assign all permissions to admin role
INSERT INTO RolePermissions (roleId, permissionId)
SELECT r.id, p.id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.name = 'ADMIN';

-- Create triggers for updated_at
GO
CREATE TRIGGER TR_Users_UpdatedAt ON Users AFTER UPDATE AS
BEGIN
    UPDATE Users
    SET updatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.id = i.id;
END;

GO
CREATE TRIGGER TR_Sites_UpdatedAt ON Sites AFTER UPDATE AS
BEGIN
    UPDATE Sites
    SET updatedAt = GETDATE()
    FROM Sites s
    INNER JOIN inserted i ON s.id = i.id;
END;

GO
CREATE TRIGGER TR_Departments_UpdatedAt ON Departments AFTER UPDATE AS
BEGIN
    UPDATE Departments
    SET updatedAt = GETDATE()
    FROM Departments d
    INNER JOIN inserted i ON d.id = i.id;
END;

GO
CREATE TRIGGER TR_Roles_UpdatedAt ON Roles AFTER UPDATE AS
BEGIN
    UPDATE Roles
    SET updatedAt = GETDATE()
    FROM Roles r
    INNER JOIN inserted i ON r.id = i.id;
END;

GO
CREATE TRIGGER TR_Permissions_UpdatedAt ON Permissions AFTER UPDATE AS
BEGIN
    UPDATE Permissions
    SET updatedAt = GETDATE()
    FROM Permissions p
    INNER JOIN inserted i ON p.id = i.id;
END;
