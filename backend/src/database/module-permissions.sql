-- Insert module-specific permissions
INSERT INTO Permissions (name, description, module, action)
VALUES 
    -- Contract Management
    ('CONTRACT_READ', 'View contracts', 'CONTRACT', 'READ'),
    ('CONTRACT_WRITE', 'Create and modify contracts', 'CONTRACT', 'WRITE'),
    ('CONTRACT_DELETE', 'Delete contracts', 'CONTRACT', 'DELETE'),

    -- Warehouse Management
    ('WAREHOUSE_READ', 'View warehouse inventory', 'WAREHOUSE', 'READ'),
    ('WAREHOUSE_WRITE', 'Modify warehouse inventory', 'WAREHOUSE', 'WRITE'),
    ('WAREHOUSE_DELETE', 'Delete warehouse items', 'WAREHOUSE', 'DELETE'),

    -- Procurement
    ('PROCUREMENT_READ', 'View purchase orders', 'PROCUREMENT', 'READ'),
    ('PROCUREMENT_WRITE', 'Create and modify purchase orders', 'PROCUREMENT', 'WRITE'),
    ('PROCUREMENT_DELETE', 'Delete purchase orders', 'PROCUREMENT', 'DELETE'),

    -- Inventory Control
    ('INVENTORY_READ', 'View inventory', 'INVENTORY', 'READ'),
    ('INVENTORY_WRITE', 'Modify inventory', 'INVENTORY', 'WRITE'),
    ('INVENTORY_DELETE', 'Delete inventory items', 'INVENTORY', 'DELETE');

-- Assign all new permissions to admin role
INSERT INTO RolePermissions (roleId, permissionId)
SELECT r.id, p.id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.name = 'ADMIN'
AND p.name IN (
    'CONTRACT_READ', 'CONTRACT_WRITE', 'CONTRACT_DELETE',
    'WAREHOUSE_READ', 'WAREHOUSE_WRITE', 'WAREHOUSE_DELETE',
    'PROCUREMENT_READ', 'PROCUREMENT_WRITE', 'PROCUREMENT_DELETE',
    'INVENTORY_READ', 'INVENTORY_WRITE', 'INVENTORY_DELETE'
);
