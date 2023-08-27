<script>
  import Chart from 'chart.js/auto'
  export let data

  let labelsFat30 = data?.grafFat30?.map((v) => new Date(v.dia).toLocaleDateString())
  let dataFat30 = data?.grafFat30?.map((v) => v.faturamento)
  let rangeFat30 = `${labelsFat30?.at(0)} ~ ${labelsFat30?.at(-1)}`
  let ctx
  let chartObject

  $: {
    if (ctx != undefined) {
      if (chartObject != undefined) {
        chartObject.destroy()
      }

      chartObject = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labelsFat30,
          datasets: [
            {
              backgroundColor: 'rgb(80,248,120,0.4)',
              borderColor: 'rgb(80,248,120,1)',
              borderRadius: '50px',
              tension: 0.5,
              label: 'Faturamento',
              data: dataFat30,
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: { family: 'Quicksand' }
              },
              title: {
                display: true,
                text: 'Faturamento',
                font: { weight: 'bold', size: 15, family: 'Quicksand' }
              }
            },
            x: {
              ticks: {
                display: true,
                callback: (value, index, ticks) => labelsFat30[index].slice(0, 5),
                font: { family: 'Quicksand' }
              },
              title: {
                display: true,
                text: 'Dia',
                font: { weight: 'bold', size: 15, family: 'Quicksand' }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Faturamento Diário',
              font: { weight: 'bold', size: 20, family: 'Quicksand' }
            },
            subtitle: {
              display: true,
              text: rangeFat30,
              font: { size: 14, family: 'Quicksand' }
            },
            legend: {
              display: false,
              labels: {
                font: {
                  family: 'Quicksand'
                }
              }
            }
          }
        }
      })
    }
  }
</script>

<canvas class="chart" bind:this={ctx} />
