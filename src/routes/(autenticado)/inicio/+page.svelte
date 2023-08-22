<script>
  import Chart from 'chart.js/auto'

  let ctx
  let chartObject
  let data = [12, 19, 3, 5, 2, 3, 10, 20, 3, 9, 200, 9, 1, 2]

  $: {
    if (ctx != undefined) {
      if (chartObject != undefined) {
        chartObject.destroy()
      }

      chartObject = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Purple2', 'Val2', 'Graph2', 'Dap', 'Dap'],
          datasets: [
            {
              backgroundColor: 'rgb(80,248,120,0.4)',
              borderColor: 'rgb(80,248,120,1)',
              borderRadius: '50px',
              tension: 0.5,
              label: 'Receita',
              data: data,
              borderWidth: 2
            },
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Vendas nos Últimos 30 dias',
              font: { weight: 'bold', size: 20, family: 'Quicksand' }
            }, 
            legend: {
              labels: {
                font: {
                  family: "Quicksand"
                }
              }
            }
          }
        },
      })
    }
  }
</script>

<div class="flex justify-center">
  <div class="container rounded-container-token">
    <h1 class="h1 my-2"> </h1>
    <div class="grid grid-cols-12 gap-2 w-full">
      <div class="col-span-6 card bg-white dark:bg-white">
        <canvas class="chart" bind:this={ctx} />
      </div>
    </div>
  </div>
</div>
