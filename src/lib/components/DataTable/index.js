import ColunaCabecalho from "./ColunaCabecalho.svelte";
import ColunaFiltro from "./ColunaFiltro.svelte";
import DataTable from "./DataTable.svelte";
export { DataTable, ColunaCabecalho as TH, ColunaFiltro as THF }

/**
 * @typedef {{key: string, title: string, cell: function, filterBy: string | function, orderBy: string | function}} DTSColsOptions
*/