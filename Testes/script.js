var chart = new chart({
    renderTo: "chart",
    type: "line",
    data: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      datasets: [
        {
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Gráfico"
      }
    }
  });
  