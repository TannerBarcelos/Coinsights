import axios from 'axios'

export const coinFetcher = axios.create( {
    baseURL: process.env.REACT_APP_COINGECKO_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-cg-demo-api-key': process.env.REACT_APP_COINGECKO_API_KEY,
    },
} )

export const newsFetcher = axios.create( {
    baseURL: 'https://news-api14.p.rapidapi.com',
    headers: {
        'x-rapidapi-host': process.env.REACT_APP_RAPID_API_HOST,
        'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
    },
} )