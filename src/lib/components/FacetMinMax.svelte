<script>
  export let column
  export let table

  function getMinMax(columnId) {
    if (!columnId) return { min: undefined, max: undefined }
    const column = table.getColumn(columnId)
    if (!column) return { min: undefined, max: undefined }

    const facets = column.getFacetedMinMaxValues()
    if (!facets) return { min: undefined, max: undefined }

    return { min: facets[0], max: facets[1] }
  }

  let facetVals = getMinMax(column.id)

  function handleValueChange(e) {
    const target = e.target
    const value = target.value
    const name = target.name

    if (name === 'min') {
      column.setFilterValue((old) => [value, old?.[1] ?? facetVals.max])
    } else {
      column.setFilterValue((old) => [old?.[0] ?? facetVals.min, value])
    }
  }
</script>

<div class="inline-flex gap-2">
  <div>
    <label for="min" class="label">Min</label>
    <input id='min' class="input inline" type="number" name="min" min={facetVals.min} max={facetVals.max} on:change={handleValueChange} placeholder={facetVals.min?.toString()} value={facetVals.min} />
  </div>

  <div>
    <label for="max" class="label">Max</label>
    <input id='max' class="input" type="number" name="max" min={facetVals.min} max={facetVals.max} on:change={handleValueChange} placeholder={facetVals.max?.toString()} value={facetVals.max} />
  </div>
</div>
