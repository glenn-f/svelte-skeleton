//vite-node src\lib\server\db\raw\run_test_statement.js
import { FE_VENDA } from '$lib/globals'
import { db, dbInsert, dbSelectOne, dbUpdate } from '..'

const estoque_id = 1
const x = db.exec(`CREATE TABLE IF NOT EXISTS tributo_contabil (
  tributo_id INTEGER NOT NULL,
  fc_id INTEGER NOT NULL,
  PRIMARY KEY (tributo_id, fc_id) FOREIGN KEY (tributo_id) REFERENCES tributo(id),
  FOREIGN KEY (fc_id) REFERENCES fc(id),
  UNIQUE (tributo_id),
  UNIQUE (fc_id)
) STRICT;`)