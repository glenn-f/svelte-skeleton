<script>
  import Chart from 'chart.js/auto'
  export let data

  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  function formatDataGraf(data) {
    const dadosPorNome = {}
    data.forEach((item) => {
      if (!dadosPorNome[item.nome]) {
        dadosPorNome[item.nome] = {
          label: item.nome,
          data: [],
          borderColor: getRandomColor(), // Função para gerar cores aleatórias
          fill: false
        }
      }
      const valorAcumulado = dadosPorNome[item.nome].data.length > 0 ? dadosPorNome[item.nome].data[dadosPorNome[item.nome].data.length - 1].y + item.faturamento : item.faturamento

      dadosPorNome[item.nome].data.push({
        x: item.dia.substring(0,5),
        y: valorAcumulado
      })
    })
    return dadosPorNome
  }

  let dadosPorNome = formatDataGraf(data.grafPesFat30)
  let rangeFat30 = `${data.grafPesFat30?.at(0)?.dia} ~ ${data.grafPesFat30?.at(-1)?.dia}`
  let ctx
  let chartObject

  console.log(JSON.stringify(dadosPorNome, null, 1))

  $: {
    if (ctx != undefined) {
      if (chartObject != undefined) {
        chartObject.destroy()
      }

      chartObject = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: Object.values(dadosPorNome)
        },
        options: {
          scales: {
            x: {
              ticks: {
                font: {family: "Quicksand"}
              },
              title: {
                display: true,
                text: 'Dia',
                font: { weight: 'bold', size: 15, family: 'Quicksand' }
              }
            },
            y: {
              ticks: {
                font: {family: "Quicksand"}
              },
              title: {
                display: true,
                text: 'Faturamento Acumulado',
                font: { weight: 'bold', size: 15, family: 'Quicksand' }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Faturamento Acumlado por Vendedor',
              font: { weight: 'bold', size: 20, family: 'Quicksand' }
            },
            subtitle: {
              display: true,
              text: rangeFat30,
              font: { size: 14, family: 'Quicksand' }
            },
            legend: {
              display: true,
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
