import {  useEffect, useState } from "react"
import { getCrypto } from "../../api/external";
import styles from "./Crypto.module.css"
import Loader from "../../Components/Loader/Loader"

function Crypto() {

    const [crytpoData , setCrytoData] = useState([]);

    useEffect(()=>{
        //IIFE
        (async function cryptoApiCall(){
            const response = await getCrypto();
            setCrytoData(response);
            console.log('data' , response)
        }) ();

        // clean up

        setCrytoData([])

    } , [])

    if(crytpoData.length===0){
      <Loader text="crytocurrencies"/>
    }

    const negativeStyle = {
        color: "#ea3943",
      };
    
      const positiveStyle = {
        color: "#16c784",
      };


  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          <th>#</th>
          <th>Coin</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>24h</th>
        </tr>
      </thead>
      <tbody>
        {crytpoData.map((coin) => (
          <tr id={coin.id} className={styles.tableRow}>
            <td>{coin.market_cap_rank}</td>
            <td>
              <div className={styles.logo}>
                <img src={coin.image} width={40} height={40} /> {coin.name}
              </div>
            </td>
            <td>
              <div className={styles.symbol}>{coin.symbol}</div>
            </td>
            <td>{coin.current_price}</td>
            <td
              style={
                coin.price_change_percentage_24h < 0
                  ? negativeStyle
                  : positiveStyle
              }
            >
              {coin.price_change_percentage_24h}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Crypto