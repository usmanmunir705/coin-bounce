import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./error.module.css"
function error() {
    return (
        <div className={styles.errorWrapper}>
            <div className={styles.errorheader}>Error - 404 page not found</div>
                <div className={styles.errorbody}>
                    go back to 
                    <Link className={styles.navLink} to='/'> Home</Link>
                </div>
        </div>
    )
}

export default error