
import * as SQLite from "sql.js";
import { toast } from "sonner";

// SQL.js needs to fetch its wasm file, so we'll use a config object
// to specify where to find it.
const sqlConfig = {
  locateFile: (file: string) => `https://sql.js.org/dist/${file}`
};

// Initialize the database
let SQL: SQLite.SqlJsStatic;
let db: SQLite.Database | null = null;

// Initialize SQL.js
export const initDatabase = async () => {
  try {
    SQL = await SQLite.default(sqlConfig);
    db = new SQL.Database();
    
    // Create tables if they don't exist
    createTables();
    seedDemoData();
    
    return db;
  } catch (err) {
    console.error("Failed to initialize database:", err);
    toast.error("Failed to initialize database. Please refresh the page.");
    return null;
  }
};

// Create the database schema
const createTables = () => {
  if (!db) return;
  
  // Create Racks table
  db.run(`
    CREATE TABLE IF NOT EXISTS racks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      location TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create Equipments table
  db.run(`
    CREATE TABLE IF NOT EXISTS equipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rack_id INTEGER NOT NULL,
      equipment_type TEXT NOT NULL CHECK(equipment_type IN ('PATCH_PANEL', 'SWITCH')),
      identifier TEXT NOT NULL,
      model TEXT,
      port_count INTEGER,
      u_position INTEGER,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rack_id) REFERENCES racks(id) ON DELETE CASCADE,
      UNIQUE(rack_id, identifier)
    )
  `);
  
  // Create Port Mappings table
  db.run(`
    CREATE TABLE IF NOT EXISTS port_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patch_panel_id INTEGER NOT NULL,
      physical_port_number INTEGER NOT NULL,
      logical_point_identifier TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patch_panel_id) REFERENCES equipments(id) ON DELETE CASCADE,
      UNIQUE(patch_panel_id, physical_port_number)
    )
  `);
  
  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_equipments_rack_id ON equipments(rack_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_port_mappings_patch_panel ON port_mappings(patch_panel_id)`);
};

// Seed demo data
const seedDemoData = () => {
  if (!db) return;
  
  // First, check if we already have data
  const rackCount = db.exec("SELECT COUNT(*) FROM racks")[0].values[0][0];
  
  if (rackCount > 0) {
    return; // Already seeded
  }
  
  // Add demo racks
  db.run(`
    INSERT INTO racks (name, location, description) VALUES 
    ('Rack-01', 'Data Center Floor 1', 'Main infrastructure rack'),
    ('Rack-02', 'Data Center Floor 1', 'Server rack'),
    ('Rack-03', 'Office Floor 2', 'Network distribution rack')
  `);
  
  // Add equipment to the racks
  db.run(`
    INSERT INTO equipments (rack_id, equipment_type, identifier, model, port_count, u_position, description) VALUES 
    (1, 'PATCH_PANEL', 'PP-01', 'CAT6 48-Port', 48, 1, 'Front patch panel'),
    (1, 'SWITCH', 'SW-01', 'Cisco 3850', 48, 2, 'Core switch'),
    (1, 'PATCH_PANEL', 'PP-02', 'CAT6 24-Port', 24, 3, 'Secondary patch panel'),
    (2, 'PATCH_PANEL', 'PP-01', 'CAT6 48-Port', 48, 1, 'Server connections'),
    (2, 'SWITCH', 'SW-01', 'HPE 5900', 48, 2, 'Server access switch'),
    (3, 'PATCH_PANEL', 'PP-01', 'CAT6 24-Port', 24, 1, 'Office connections')
  `);
  
  // Add some port mappings
  // For Rack-01, PP-01
  for (let i = 1; i <= 20; i++) {
    db.run(`
      INSERT INTO port_mappings (patch_panel_id, physical_port_number, logical_point_identifier, description)
      VALUES (1, ${i}, '10${i}', 'Office workstation ${i}')
    `);
  }
  
  // For Rack-03, PP-01
  for (let i = 1; i <= 15; i++) {
    db.run(`
      INSERT INTO port_mappings (patch_panel_id, physical_port_number, logical_point_identifier, description)
      VALUES (6, ${i}, '30${i}', 'Floor 2 workstation ${i}')
    `);
  }
};

// Database operation functions

// Racks
export const getRacks = (): Rack[] => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec("SELECT id, name, location, description FROM racks ORDER BY name");
  
  if (result.length === 0) return [];
  
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const rack: any = {};
    columns.forEach((col, i) => {
      rack[col] = row[i];
    });
    return rack as Rack;
  });
};

export const getRackById = (id: number): Rack | null => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec(`
    SELECT id, name, location, description 
    FROM racks 
    WHERE id = ${id}
  `);
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  
  const rack: any = {};
  columns.forEach((col, i) => {
    rack[col] = row[i];
  });
  
  return rack as Rack;
};

export const createRack = (rack: Omit<Rack, 'id'>): number => {
  if (!db) throw new Error("Database not initialized");
  
  try {
    db.run(`
      INSERT INTO racks (name, location, description)
      VALUES (?, ?, ?)
    `, [rack.name, rack.location || null, rack.description || null]);
    
    const result = db.exec("SELECT last_insert_rowid()");
    const id = result[0].values[0][0] as number;
    
    return id;
  } catch (err) {
    console.error("Error creating rack:", err);
    throw err;
  }
};

export const updateRack = (id: number, rack: Partial<Rack>): void => {
  if (!db) throw new Error("Database not initialized");
  
  const updates = [];
  const values = [];
  
  if (rack.name !== undefined) {
    updates.push("name = ?");
    values.push(rack.name);
  }
  
  if (rack.location !== undefined) {
    updates.push("location = ?");
    values.push(rack.location);
  }
  
  if (rack.description !== undefined) {
    updates.push("description = ?");
    values.push(rack.description);
  }
  
  if (updates.length === 0) return;
  
  updates.push("updated_at = CURRENT_TIMESTAMP");
  
  try {
    db.run(`
      UPDATE racks
      SET ${updates.join(", ")}
      WHERE id = ?
    `, [...values, id]);
  } catch (err) {
    console.error("Error updating rack:", err);
    throw err;
  }
};

export const deleteRack = (id: number): void => {
  if (!db) throw new Error("Database not initialized");
  
  try {
    db.run(`DELETE FROM racks WHERE id = ?`, [id]);
  } catch (err) {
    console.error("Error deleting rack:", err);
    throw err;
  }
};

// Equipment
export const getEquipmentByRackId = (rackId: number): Equipment[] => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec(`
    SELECT id, rack_id, equipment_type, identifier, model, port_count, u_position, description
    FROM equipments
    WHERE rack_id = ${rackId}
    ORDER BY u_position NULLS LAST, identifier
  `);
  
  if (result.length === 0) return [];
  
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const equipment: any = {};
    columns.forEach((col, i) => {
      equipment[col] = row[i];
    });
    return equipment as Equipment;
  });
};

export const getEquipmentById = (id: number): Equipment | null => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec(`
    SELECT id, rack_id, equipment_type, identifier, model, port_count, u_position, description
    FROM equipments
    WHERE id = ${id}
  `);
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  
  const equipment: any = {};
  columns.forEach((col, i) => {
    equipment[col] = row[i];
  });
  
  return equipment as Equipment;
};

export const createEquipment = (equipment: Omit<Equipment, 'id'>): number => {
  if (!db) throw new Error("Database not initialized");
  
  try {
    db.run(`
      INSERT INTO equipments (
        rack_id, equipment_type, identifier, model, port_count, u_position, description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      equipment.rack_id,
      equipment.equipment_type,
      equipment.identifier,
      equipment.model || null,
      equipment.port_count || null,
      equipment.u_position || null,
      equipment.description || null
    ]);
    
    const result = db.exec("SELECT last_insert_rowid()");
    const id = result[0].values[0][0] as number;
    
    return id;
  } catch (err) {
    console.error("Error creating equipment:", err);
    throw err;
  }
};

export const updateEquipment = (id: number, equipment: Partial<Equipment>): void => {
  if (!db) throw new Error("Database not initialized");
  
  const updates = [];
  const values = [];
  
  if (equipment.rack_id !== undefined) {
    updates.push("rack_id = ?");
    values.push(equipment.rack_id);
  }
  
  if (equipment.equipment_type !== undefined) {
    updates.push("equipment_type = ?");
    values.push(equipment.equipment_type);
  }
  
  if (equipment.identifier !== undefined) {
    updates.push("identifier = ?");
    values.push(equipment.identifier);
  }
  
  if (equipment.model !== undefined) {
    updates.push("model = ?");
    values.push(equipment.model);
  }
  
  if (equipment.port_count !== undefined) {
    updates.push("port_count = ?");
    values.push(equipment.port_count);
  }
  
  if (equipment.u_position !== undefined) {
    updates.push("u_position = ?");
    values.push(equipment.u_position);
  }
  
  if (equipment.description !== undefined) {
    updates.push("description = ?");
    values.push(equipment.description);
  }
  
  if (updates.length === 0) return;
  
  updates.push("updated_at = CURRENT_TIMESTAMP");
  
  try {
    db.run(`
      UPDATE equipments
      SET ${updates.join(", ")}
      WHERE id = ?
    `, [...values, id]);
  } catch (err) {
    console.error("Error updating equipment:", err);
    throw err;
  }
};

export const deleteEquipment = (id: number): void => {
  if (!db) throw new Error("Database not initialized");
  
  try {
    db.run(`DELETE FROM equipments WHERE id = ?`, [id]);
  } catch (err) {
    console.error("Error deleting equipment:", err);
    throw err;
  }
};

// Port Mappings
export const getPortMappingsByPatchPanelId = (patchPanelId: number): PortMapping[] => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec(`
    SELECT id, patch_panel_id, physical_port_number, logical_point_identifier, description
    FROM port_mappings
    WHERE patch_panel_id = ${patchPanelId}
    ORDER BY physical_port_number
  `);
  
  if (result.length === 0) return [];
  
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const mapping: any = {};
    columns.forEach((col, i) => {
      mapping[col] = row[i];
    });
    return mapping as PortMapping;
  });
};

export const getPortMappingByLogicalPoint = (logicalPointId: string): PortMappingDetail | null => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec(`
    SELECT 
      pm.id, 
      pm.patch_panel_id, 
      pm.physical_port_number, 
      pm.logical_point_identifier, 
      pm.description,
      e.identifier AS panel_identifier,
      r.id AS rack_id,
      r.name AS rack_name
    FROM port_mappings pm
    JOIN equipments e ON pm.patch_panel_id = e.id
    JOIN racks r ON e.rack_id = r.id
    WHERE pm.logical_point_identifier = '${logicalPointId}'
  `);
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  
  const mapping: any = {};
  columns.forEach((col, i) => {
    mapping[col] = row[i];
  });
  
  return mapping as PortMappingDetail;
};

export const getPortMappingByPhysicalLocation = (
  rackId: number, 
  panelIdentifier: string, 
  portNumber: number
): PortMapping | null => {
  if (!db) throw new Error("Database not initialized");
  
  const result = db.exec(`
    SELECT pm.id, pm.patch_panel_id, pm.physical_port_number, pm.logical_point_identifier, pm.description
    FROM port_mappings pm
    JOIN equipments e ON pm.patch_panel_id = e.id
    WHERE e.rack_id = ${rackId}
      AND e.identifier = '${panelIdentifier}'
      AND e.equipment_type = 'PATCH_PANEL'
      AND pm.physical_port_number = ${portNumber}
  `);
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  
  const mapping: any = {};
  columns.forEach((col, i) => {
    mapping[col] = row[i];
  });
  
  return mapping as PortMapping;
};

export const createPortMapping = (mapping: Omit<PortMapping, 'id'>): number => {
  if (!db) throw new Error("Database not initialized");
  
  try {
    db.run(`
      INSERT INTO port_mappings (
        patch_panel_id, physical_port_number, logical_point_identifier, description
      )
      VALUES (?, ?, ?, ?)
    `, [
      mapping.patch_panel_id,
      mapping.physical_port_number,
      mapping.logical_point_identifier,
      mapping.description || null
    ]);
    
    const result = db.exec("SELECT last_insert_rowid()");
    const id = result[0].values[0][0] as number;
    
    return id;
  } catch (err) {
    console.error("Error creating port mapping:", err);
    throw err;
  }
};

export const updatePortMapping = (id: number, mapping: Partial<PortMapping>): void => {
  if (!db) throw new Error("Database not initialized");
  
  const updates = [];
  const values = [];
  
  if (mapping.patch_panel_id !== undefined) {
    updates.push("patch_panel_id = ?");
    values.push(mapping.patch_panel_id);
  }
  
  if (mapping.physical_port_number !== undefined) {
    updates.push("physical_port_number = ?");
    values.push(mapping.physical_port_number);
  }
  
  if (mapping.logical_point_identifier !== undefined) {
    updates.push("logical_point_identifier = ?");
    values.push(mapping.logical_point_identifier);
  }
  
  if (mapping.description !== undefined) {
    updates.push("description = ?");
    values.push(mapping.description);
  }
  
  if (updates.length === 0) return;
  
  updates.push("updated_at = CURRENT_TIMESTAMP");
  
  try {
    db.run(`
      UPDATE port_mappings
      SET ${updates.join(", ")}
      WHERE id = ?
    `, [...values, id]);
  } catch (err) {
    console.error("Error updating port mapping:", err);
    throw err;
  }
};

export const deletePortMapping = (id: number): void => {
  if (!db) throw new Error("Database not initialized");
  
  try {
    db.run(`DELETE FROM port_mappings WHERE id = ?`, [id]);
  } catch (err) {
    console.error("Error deleting port mapping:", err);
    throw err;
  }
};

// Export database for potential download
export const exportDatabase = (): Uint8Array => {
  if (!db) throw new Error("Database not initialized");
  return db.export();
};

// Import database from file
export const importDatabase = (data: Uint8Array): void => {
  try {
    if (!SQL) throw new Error("SQL.js not initialized");
    
    // Close existing database if open
    if (db) {
      db.close();
    }
    
    // Create new database from imported data
    db = new SQL.Database(data);
    
    toast.success("Database imported successfully");
  } catch (err) {
    console.error("Error importing database:", err);
    toast.error("Failed to import database");
    
    // Try to recreate the database
    initDatabase();
  }
};

// Types
export interface Rack {
  id: number;
  name: string;
  location?: string;
  description?: string;
}

export interface Equipment {
  id: number;
  rack_id: number;
  equipment_type: 'PATCH_PANEL' | 'SWITCH';
  identifier: string;
  model?: string;
  port_count?: number;
  u_position?: number;
  description?: string;
}

export interface PortMapping {
  id: number;
  patch_panel_id: number;
  physical_port_number: number;
  logical_point_identifier: string;
  description?: string;
}

export interface PortMappingDetail extends PortMapping {
  panel_identifier: string;
  rack_id: number;
  rack_name: string;
}
