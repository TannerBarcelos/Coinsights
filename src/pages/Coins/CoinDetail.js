import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { coinFetcher, newsFetcher } from '../../common/utils/axios'
import { Container } from 'reactstrap'
import PaginationBar from '../../components/Shared/PaginationBar'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import {
  createDatePriceCollection,
} from '../../common/utils/formatters/dateConversion'
import { slicePathName } from '../../common/utils/formatters/slicePathName'
import { dataObj, optionsObj } from '../../chart/chartConfig'
import CoinNewsTable from './CoinNewsTable'

const CoinDetail = ( { location } ) => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState( false )
  const [paginatedDayValue, setPaginatedDayValue] = useState( 7 )

  const [coinData, setCoinData] = useState( undefined )
  const [coinPrices, setCoinPrices] = useState( [] )
  const [coinNews, setCoinNews] = useState( [] )

  const coinName = slicePathName( location.pathname )

  useEffect( () => {
    const fetchCoinData = async () => {
      try {
        const { data } = await coinFetcher.get( `/coins/${coinName}` )
        return data
      } catch ( e ) {
        history.push( '/' )
      }
    }

    const fetchCoinPrices = async () => {
      try {
        const { data: { prices } } = await coinFetcher.get( `/coins/${coinName}/market_chart?vs_currency=usd&interval=daily&days=${paginatedDayValue}` )
        return prices
      } catch ( e ) {
        console.error( e )
      }
    }

    const fetchCoinNews = async () => {
      const params = new URLSearchParams( {
        q: coinName,
        country: 'us',
        language: 'en',
        pageSize: '10',
        publisher: 'cnn.com,bbc.com'
      } )
      const { data: { articles } } = await newsFetcher.get( `/search?${params.toString()}` )
      return articles
    }

    ( async () => {
      setIsLoading( true )
      const coinData = await Promise.allSettled( [fetchCoinData(), fetchCoinPrices(), fetchCoinNews()] )
      setCoinData( coinData[0].value )
      setCoinPrices( coinData[1].value )
      setCoinNews( coinData[2].value )
      setIsLoading( false )
    } )()
  }, [setCoinData, paginatedDayValue, coinName, history] )


  const formattedCoinPrices = () => {
    return coinPrices ? createDatePriceCollection( coinPrices ) : []
  }

  return <Container className='coin_container'>
    {isLoading && <LoadingSpinner />}
    <div>
      <div className='top-info'>
        <h1>{coinData && coinData.id}</h1>
        <div className='insight-numbers'>
          <span>Current price: ${coinData && coinData?.market_data?.current_price?.usd}</span>
        </div>
      </div>
      <Link to='/coins'>
        <i className='fas fa-arrow-left back-btn'></i>
      </Link>
      <p
        style={{
          marginTop: '1rem',
        }}
      >
        Select number of days to look back at price fluctuation
      </p>
      <PaginationBar
        setPagination={setPaginatedDayValue}
        nums={[7, 14, 30, 90, 365]}
        className='pagination-bar-coin-details'
      />
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: 'wrap' }}>
        <small>Categories:</small>
        {coinData && coinData.categories.map( c => {
          return <div key={c.id} style={{
            backgroundColor: "#0a0842",
            padding: "10px",
            margin: "10px",
            minWidth: "50px",
            height: "30px",
            borderRadius: "50px",
            border: "1px solid #d3d3d3",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            fontSize: '12px'
          }}>{c}</div>
        } )}
      </div>
    </div>
    <div style={{ marginTop: '50px' }}>
      {coinData && <Line
        data={dataObj( formattedCoinPrices() )}
        options={optionsObj( coinData.id, paginatedDayValue )}
      />}
    </div>
    <h1 style={{ marginTop: '4rem' }}>Latest News</h1>
    {coinNews && coinNews.length > 0 && <CoinNewsTable coinNews={coinNews} />}
  </Container>

}

export default CoinDetail
