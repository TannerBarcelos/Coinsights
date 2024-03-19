import React from 'react'

const CoinNewsTable = ( { coinNews } ) => {
    const columnsFromCoinNewsArray = Object.keys( coinNews[0] ).map( ( key, index ) => {
        const titledCase = key.split( '_' ).map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) ).join( ' ' )
        return <th key={index}>{titledCase}</th>
    } )
    return (
        <table class="table" style={{ marginTop: "2rem" }}>
            <thead>
                <tr>
                    {columnsFromCoinNewsArray}
                </tr>
            </thead>
            <tbody>
                {coinNews.map( ( newsItem, index ) => {
                    const values = Object.values( newsItem ).map( value => value )
                    return (
                        <tr key={index}>
                            {values.map( ( value, index ) => {
                                if ( typeof value === 'object' ) {
                                    return <td key={index}>{
                                        <a href={value.url} target='_blank' rel="noreferrer">{value.name}</a>
                                    }</td>
                                }
                                if ( value.includes( 'https' ) ) {
                                    return <td key={index}><a className='linker' href={value} target='_blank' rel="noreferrer">Read more</a></td>
                                } else {
                                    return <td key={index}>{value}</td>
                                }

                            } )}
                        </tr>
                    )
                } )}
            </tbody>
        </table>
    )
}

export default CoinNewsTable