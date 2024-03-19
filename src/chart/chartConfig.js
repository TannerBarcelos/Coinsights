export const dataObj = ( coinData ) => {
  return {
    labels: coinData.map( ( price ) => price.date ),
    datasets: [
      {
        fill: true,
        label: '$',
        lineTension: 0.5,
        borderColor: 'rgba(255,255,255,0.7)',
        borderWidth: 2,
        data: coinData.map( ( price ) => parseFloat( price.price ) ),
        backgroundColor: 'rgba(0,100, 255, 0.2)',
      },
    ],
  }
}

export const optionsObj = ( coinName, paginatedDayValue ) => {
  return {
    title: {
      display: true,
      text: `${coinName} prices the last ${paginatedDayValue} days`,
      fontSize: 30,
      fontColor: '#fff',
      fontFamily: "'Dosis', sans-serif",
      padding: 30,
    },
    legend: {
      display: false,
      position: 'bottom',
    },

    scales: {
      xAxes: [
        {
          label: 'Price',
          ticks: {
            beginAtZero: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Price range in $',
          },
        },
      ],
    },
  }
}
