const mssql = {
  ConnectionPool: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    request: jest.fn().mockReturnValue({
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ recordset: [] })
    })
  })),
  Request: jest.fn(),
  VarChar: jest.fn(),
  Int: jest.fn(),
  config: {
    user: 'test_user',
    password: 'test_password',
    database: 'test_db',
    server: 'localhost',
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  }
};

export = mssql;
