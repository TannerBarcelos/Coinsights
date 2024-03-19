import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs'
import { addToWatchlist, removeFromWatchlist } from '../../common/utils/watchlistUtils'
import { formatPricing } from '../../common/utils/formatters/formatPricing'
import {
  Button,
  Container,
  Table,
  InputGroup,
  InputGroupAddon,
  Input,
} from 'reactstrap'
import PaginationBar from '../../components/Shared/PaginationBar'
import LoadingSpinner from '../../components/Shared/LoadingSpinner'
import Watchlist from '../../components/Watchlist/Watchlist'
import TrendingList from '../../components/Trending/TrendingList'
import { coinFetcher } from '../../common/utils/axios'

const CoinDetails = () => {

  const { logOut, currentUser } = useAuth()

  const watchListFromLocalStorage = JSON.parse(
    localStorage.getItem( 'watchList' ),
  )

  if ( !watchListFromLocalStorage ) {
    localStorage.setItem( 'watchList', JSON.stringify( { user: currentUser.uid, coins: [] } ) )
  }

  const [coins, setCoins] = useState( [] )
  const [watchList, setWatchList] = useState(
    watchListFromLocalStorage,
  )
  const [paginatedValue, setPaginatedValue] = useState( 1 ) // allow pagination
  const [isLoading, setIsLoading] = useState( false )
  const [cryptoName, setCryptoName] = useState( {} )


  const history = useHistory()
  const handleInputChange = ( event ) => {
    const { name, value } = event.target
    setCryptoName( { ...cryptoName, [name]: value.replace( ' ', '-' ) } )
  }

  const validateSearch = ( term ) => {
    if ( !term || term.length === 0 ) {
      alert( 'Please enter a valid coin' )
      return false
    } else {
      history.push( `/coin/${cryptoName.crypto}` )
    }
  }
  const [trendingCoins, setTrendingCoins] = useState( [] )

  useEffect( () => {

    const fetchTrendingCoins = async () => {
      try {
        const {
          data: { coins },
        } = await coinFetcher.get( '/search/trending' )
        return coins
      } catch ( error ) {
        console.error( error )
      }
    }

    const fetchAllCoins = async () => {
      try {
        const { data } = await coinFetcher.get( `/coins/markets?vs_currency=usd&page=${paginatedValue}&per_page=10` )
        return data
      } catch ( error ) {
        console.error( error )
      }
    }

    ( async () => {
      setIsLoading( true )
      try {
        const coinData = await Promise.allSettled( [fetchAllCoins(), fetchTrendingCoins()] )
        setCoins( coinData[0].value )
        setTrendingCoins( coinData[1].value )
      } catch ( error ) {
        console.error( error )
      }
      setIsLoading( false )
    } )()

  }, [paginatedValue, currentUser] )

  const paginate = ( val ) => setPaginatedValue( val )

  const logout = async () => {
    try {
      await logOut()
      history.push( '/' )
    } catch ( error ) {
      console.error( error )
    }
  }

  return (
    <div>
      <Container className='coins_container'>
        {watchList && <Watchlist watchList={watchList} setWatchList={setWatchList} />}
        <TrendingList trendingList={trendingCoins} />
        {isLoading && <LoadingSpinner />}
        <h1>All Coins</h1>
        <i
          className='fas fa-sign-out-alt logout-btn'
          onClick={logout}
          title='Logout'
        ></i>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div></div>
          <div>
            <InputGroup>
              <InputGroupAddon addonType='append'>
                <Input
                  onChange={handleInputChange}
                  name='crypto'
                  placeholder='enter cryto coin name'
                  className='coin-inp'
                />
                <Button
                  className='cta-search'
                  style={{ marginLeft: '1rem' }}
                  onClick={() => validateSearch( cryptoName.crypto )}
                >
                  Search
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <PaginationBar
          setPagination={paginate}
          nums={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          className='pagination-bar'
        />
        <Table style={{ marginTop: '4rem' }}>
          <thead>
            <tr>
              <th>Rank (#)</th>
              <th>Symbol</th>
              <th>Coin</th>
              <th>Current Price</th>
              <th>Market Cap ($)</th>
              <th>Add to Watchlist</th>
              <th>Get More Insights</th>
            </tr>
          </thead>
          <tbody>
            {coins &&
              coins.map( ( coin ) => {
                return (
                  <tr key={coin.id}>
                    <td className='coin-market'>
                      <span>{coin.market_cap_rank}</span>
                    </td>
                    <td className='coin-symbol'>
                      <span>{coin.symbol}</span>
                    </td>
                    <td className='coin-dat'>
                      <div>
                        <img src={coin.image} alt={coin.id} />
                        {coin.id}
                      </div>
                    </td>
                    <td className='coin-price'>
                      <span>$ {coin.current_price.toFixed( 2 )}</span>
                    </td>
                    <td className='coin-market'>
                      <span>{formatPricing( coin.market_cap )}</span>
                    </td>
                    <td>
                      {watchList && watchList.coins.length > 0 && watchList.coins.some( ( el ) => el.id === coin.id ) ? <BsBookmark
                        className='cta-watch'
                        title='Item already in watchlist. Click to remove'
                        onClick={() =>
                          removeFromWatchlist( coin.id, setWatchList )
                        }
                      /> : <BsFillBookmarkFill
                        className='cta-watch'
                        onClick={() =>
                          addToWatchlist( coin, setWatchList, currentUser )
                        }
                      />}
                    </td>
                    <td>
                      <Link to={`/coin/${coin.id}`} className='coin-link'>
                        See more
                      </Link>
                    </td>
                  </tr>
                )
              } )}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}

export default CoinDetails
