import React from 'react';
import styles from '../Landing/Landing.module.css';
import ResponsiveAppBar from './Header';

const LandingPage = () => {
    return (
        <div className={styles.landingPage}>
            <ResponsiveAppBar/>
        </div>
    );
};

export default LandingPage;
