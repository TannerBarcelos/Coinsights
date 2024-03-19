import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import {
  removeFromWatchlist,
  clearWatchlist,
} from '../../common/utils/watchlistUtils'
import WatchlistItem from './WatchlistItem'

const Watchlist = ({ watchList, setWatchList }) => {
  const { coins } = watchList
  const history = useHistory()
  return (
    <div className='watchlist'>
      <div className='watchlist-top-container'>
        <h6>My Watchlist</h6>
        {coins && coins.length > 0 && (
          <Button
            className='cta cta-watch-list'
            onClick={() => clearWatchlist(setWatchList)}
          >
            Clear
          </Button>
        )}
      </div>
      {coins && coins.length > 0 ? (
        coins.map((coin) => (
          <WatchlistItem
            coin={coin}
            history={history}
            setWatchList={setWatchList}
            removeFromWatchlist={removeFromWatchlist}
          />
        ))
      ) : (
        <p className='addTW'>Add to your watchlist</p>
      )}
    </div>
  )
}
export default Watchlist
