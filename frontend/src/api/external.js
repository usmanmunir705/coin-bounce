//fe0e846cd46d4e8292be0b01239538b6

import axios from "axios";

const NEWS_API_KEY='fe0e846cd46d4e8292be0b01239538b6';

const NEWS_API_ENDPOINT= `https://newsapi.org/v2/everything?q=business AND 
blockchain&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`

const CRYPTO_API_ENDPOINT=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`

export const getNews = async()=>{
    let response;

    try {
        response=await axios.get(NEWS_API_ENDPOINT)
        response=response.data.articles.slice(0,16);
    } catch (error) {
        return error
    }

    return response
}

export const getCrypto = async()=>{
    let response;
    try {
        response = await axios.get(CRYPTO_API_ENDPOINT)
        response = response.data;
        // console.log('data :' ,response)
        
    } catch (error) {
        return error
    }
    return response
}