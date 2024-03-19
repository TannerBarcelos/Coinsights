export const removeFromWatchlist = ( id, setWatchList ) => {
  const { coins, user } = getWatchlistFromLocalStorage()
  const removedCoinList = coins.filter( ( coin ) => coin.id !== id )
  setWatchList( old => ( { ...old, coins: removedCoinList } ) )
  setWatchListToLocalStorage( { user, coins: removedCoinList } )
}

export const addToWatchlist = ( coin, setWatchList, currentUser ) => {

  const watchlist = {
    user: currentUser.uid,
    coins: [],
  }

  const {
    current_price,
    image,
    market_cap_rank,
    price_change_percentage_24h,
    id,
    symbol,
  } = coin

  const newWatchlistCoin = {
    current_price,
    image,
    market_cap_rank,
    price_change_percentage_24h,
    id,
    symbol,
  }


  if ( findDuplicateWatchlistItem( watchlist.coins, id ) ) {
    alert( 'Item already exists in watchlist. Please remove it then try again.' )
    return
  }

  let currentWatchlistFromLocalStorage = getWatchlistFromLocalStorage()

  if ( !currentWatchlistFromLocalStorage ) {
    watchlist.coins.push( newWatchlistCoin )
    setWatchList( watchlist )
    setWatchListToLocalStorage( watchlist )
  } else {
    watchlist.coins = [newWatchlistCoin, ...currentWatchlistFromLocalStorage.coins]
    setWatchList( watchlist )
    setWatchListToLocalStorage( watchlist )
  }
}

export const clearWatchlist = ( setWatchList ) => {
  setWatchList( oldState => {
    localStorage.setItem( 'watchList', JSON.stringify( { ...oldState, coins: [] } ) )
    return { ...oldState, coins: [] }
  } )

}

export const findDuplicateWatchlistItem = ( arr, id ) => {
  return arr.some( ( el ) => el.id === id )
}

export const getWatchlistFromLocalStorage = () => {
  return JSON.parse( localStorage.getItem( 'watchList' ) )
}

export const setWatchListToLocalStorage = ( watchlist ) => {
  localStorage.setItem( 'watchList', JSON.stringify( watchlist ) )
}

export const checkUserWatchlist = ( uid ) => {
  const watchlist = getWatchlistFromLocalStorage()
  if ( !watchlist ) return
  if ( watchlist.user !== uid ) {
    console.log( watchlist.user, " .... ", uid )
    localStorage.removeItem( process.env.REACT_APP_WATCHLIST_NAME )
  }
}