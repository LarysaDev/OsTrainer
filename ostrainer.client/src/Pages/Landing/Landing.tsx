import * as React from 'react';
import styles from '../Landing/Landing.module.css';
import ResponsiveAppBar from './Header';
import ExploreTheRole from './ExploreTheRole';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className={styles.landingPage}>
            <ResponsiveAppBar/>
            <div className={styles.explore}>
                <ExploreTheRole role='student' theme='dark' />
                <ExploreTheRole role='teacher' theme='light' />
            </div>
            <Footer/>
        </div>
    );
};

export default LandingPage;
